"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import Link from "next/link";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ArrowLeft,
  Loader2,
  PictureInPicture2,
  Gauge,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { StreamSource, Subtitle as OmssSubtitle } from "@/types/omss";
import { QualitySelector, QualityOption } from "./QualitySelector";
import { AudioSelector, AudioTrackOption } from "./AudioSelector";
import { SubtitleSelector, SubtitleOption } from "./SubtitleSelector";
import { ServerSelector } from "./ServerSelector";
import { NextEpisodeOverlay } from "./NextEpisodeOverlay";
import { saveWatchProgress } from "@/lib/storage";

interface VideoPlayerProps {
  sources: StreamSource[];
  subtitles?: OmssSubtitle[];
  mediaType: "movie" | "tv";
  tmdbId: number;
  title: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  nextEpisodeUrl?: string;
  nextEpisodeNumber?: number;
  nextEpisodeTitle?: string;
  initialTime?: number;
}

export function VideoPlayer({
  sources,
  subtitles = [],
  mediaType,
  tmdbId,
  title,
  posterPath,
  backdropPath,
  season,
  episode,
  episodeTitle,
  nextEpisodeUrl,
  nextEpisodeNumber,
  nextEpisodeTitle,
  initialTime = 0,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Active source
  const [activeSource, setActiveSource] = useState<StreamSource>(
    sources[0] || null
  );

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);

  // Quality, Audio, Subtitle states
  const [availableQualities, setAvailableQualities] = useState<QualityOption[]>(
    []
  );
  const [selectedQualityId, setSelectedQualityId] = useState<string>("auto");

  const [availableAudioTracks, setAvailableAudioTracks] = useState<
    AudioTrackOption[]
  >([]);
  const [selectedAudioId, setSelectedAudioId] = useState<string>("0");

  const [availableSubtitles, setAvailableSubtitles] = useState<SubtitleOption[]>(
    []
  );
  const [selectedSubtitleId, setSelectedSubtitleId] = useState<string>("off");

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "00:00";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Activity timer for controls auto-hiding
  const handleUserActivity = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !speedMenuOpen) {
        setShowControls(false);
      }
    }, 3500);
  }, [isPlaying, speedMenuOpen]);

  // Controls Actions wrapped in useCallback
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  const seekBy = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  }, []);

  const changeVolume = useCallback((newVol: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = newVol;
    setVolume(newVol);
    if (newVol === 0) {
      setIsMuted(true);
      video.muted = true;
    } else {
      setIsMuted(false);
      video.muted = false;
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && volume === 0) {
      video.volume = 0.5;
      setVolume(0.5);
    }
  }, [volume]);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  // Save playback progress periodically
  const persistProgress = useCallback(
    (timeToSave: number, durToSave: number) => {
      if (timeToSave > 2 && durToSave > 0) {
        saveWatchProgress({
          tmdbId,
          type: mediaType,
          title,
          posterPath,
          backdropPath,
          season,
          episode,
          episodeTitle,
          progress: timeToSave,
          duration: durToSave,
        });
      }
    },
    [tmdbId, mediaType, title, posterPath, backdropPath, season, episode, episodeTitle]
  );

  // Setup stream with Hls.js or direct HTML5 video
  const setupStream = useCallback(
    (source: StreamSource) => {
      const video = videoRef.current;
      if (!video || !source) return;

      setPlayerError(null);
      setIsBuffering(true);

      // Initialize audio tracks immediately from OMSS source definition
      if (source.audioTracks && source.audioTracks.length > 1) {
        const tracks: AudioTrackOption[] = source.audioTracks.map((lang, i) => ({
          id: `lang-${i}`,
          label: lang,
        }));
        setAvailableAudioTracks(tracks);
        setSelectedAudioId("lang-0");
      } else {
        setAvailableAudioTracks([]);
      }

      // Clean up previous HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      const isM3u8 =
        source.type === "hls" ||
        source.url.includes(".m3u8") ||
        source.format === "hls";

      if (isM3u8 && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });
        hlsRef.current = hls;

        hls.loadSource(source.url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
          setIsBuffering(false);

          if (data.levels && data.levels.length > 1) {
            const levels: QualityOption[] = [
              { id: "auto", label: "Auto" },
              ...data.levels.map((lvl, index) => {
                const height = lvl.height || 720;
                return {
                  id: `level-${index}`,
                  label: `${height}p`,
                  levelIndex: index,
                };
              }),
            ];
            setAvailableQualities(levels);
            setSelectedQualityId("auto");
          } else {
            const label = source.quality || "Auto";
            setAvailableQualities([{ id: "source-quality", label }]);
            setSelectedQualityId("source-quality");
          }

          if (initialTime > 0 && initialTime < (video.duration || 99999)) {
            video.currentTime = initialTime;
          }

          video.play().catch(() => setIsPlaying(false));
        });

        hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (_, data) => {
          if (data.audioTracks && data.audioTracks.length > 1) {
            const tracks: AudioTrackOption[] = data.audioTracks.map((trk, i) => ({
              id: `audio-${i}`,
              label: trk.name || trk.lang || `Track ${i + 1}`,
              hlsTrackIndex: i,
            }));
            setAvailableAudioTracks(tracks);
            setSelectedAudioId(`audio-${hls.audioTrack}`);
          } else if (source.audioTracks && source.audioTracks.length > 1) {
            const tracks: AudioTrackOption[] = source.audioTracks.map((lang, i) => ({
              id: `lang-${i}`,
              label: lang,
            }));
            setAvailableAudioTracks(tracks);
            setSelectedAudioId("lang-0");
          } else {
            setAvailableAudioTracks([]);
          }
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.warn("HLS fatal network error, attempting recovery...");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.warn("HLS fatal media error, recovering...");
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                setPlayerError(
                  "Unable to play this video stream. Please switch server or try again later."
                );
                break;
            }
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl") || !isM3u8) {
        video.src = source.url;

        const label = source.quality || "Auto";
        setAvailableQualities([{ id: "single", label }]);
        setSelectedQualityId("single");

        if (source.audioTracks && source.audioTracks.length > 1) {
          const tracks: AudioTrackOption[] = source.audioTracks.map((lang, i) => ({
            id: `lang-${i}`,
            label: lang,
          }));
          setAvailableAudioTracks(tracks);
          setSelectedAudioId("lang-0");
        } else {
          setAvailableAudioTracks([]);
        }

        if (initialTime > 0) {
          video.currentTime = initialTime;
        }

        video.play().catch(() => setIsPlaying(false));
      } else {
        setPlayerError("Your browser does not support HLS streaming.");
      }
    },
    [initialTime]
  );

  // Initialize stream on mount or active source change
  useEffect(() => {
    if (activeSource) {
      setupStream(activeSource);
    }
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [activeSource, setupStream]);

  // Initialize Subtitles from OMSS response
  useEffect(() => {
    const subs: SubtitleOption[] = [{ id: "off", label: "Off" }];
    if (subtitles && subtitles.length > 0) {
      subtitles.forEach((s, idx) => {
        subs.push({
          id: s.id || `sub-${idx}`,
          label: s.label || `Subtitle ${idx + 1}`,
          url: s.url,
          trackIndex: idx,
        });
      });
    }
    setAvailableSubtitles(subs);
    setSelectedSubtitleId("off");
  }, [subtitles]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => {
      setIsPlaying(false);
      persistProgress(video.currentTime, video.duration);
    };
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (Math.floor(video.currentTime) % 5 === 0) {
        persistProgress(video.currentTime, video.duration);
      }
    };
    const onDurationChange = () => setDuration(video.duration);
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    const onEnded = () => {
      setIsPlaying(false);
      setIsFinished(true);
      persistProgress(video.duration, video.duration);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("ended", onEnded);
    };
  }, [persistProgress]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Keyboard shortcut handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["input", "textarea"].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }
      const video = videoRef.current;
      if (!video) return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "arrowleft":
          e.preventDefault();
          seekBy(-10);
          break;
        case "arrowright":
          e.preventDefault();
          seekBy(10);
          break;
        case "arrowup":
          e.preventDefault();
          changeVolume(Math.min(1, volume + 0.1));
          break;
        case "arrowdown":
          e.preventDefault();
          changeVolume(Math.max(0, volume - 0.1));
          break;
      }
      handleUserActivity();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [volume, handleUserActivity, togglePlay, toggleFullscreen, toggleMute, seekBy, changeVolume]);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video || !document.pictureInPictureEnabled) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (e) {
      console.warn("Picture-in-picture failed:", e);
    }
  };

  const handleSpeedChange = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = speed;
    setPlaybackSpeed(speed);
    setSpeedMenuOpen(false);
  };

  // Switch Quality
  const handleQualitySelect = (quality: QualityOption) => {
    setSelectedQualityId(quality.id);
    const hls = hlsRef.current;
    if (hls) {
      if (quality.id === "auto") {
        hls.currentLevel = -1; // Auto level
      } else if (quality.levelIndex !== undefined) {
        hls.currentLevel = quality.levelIndex;
      }
    }
  };

  // Switch Audio
  const handleAudioSelect = (track: AudioTrackOption) => {
    setSelectedAudioId(track.id);
    const hls = hlsRef.current;
    if (hls && track.hlsTrackIndex !== undefined) {
      hls.audioTrack = track.hlsTrackIndex;
    }
  };

  // Switch Subtitles
  const handleSubtitleSelect = (sub: SubtitleOption) => {
    setSelectedSubtitleId(sub.id);
    const video = videoRef.current;
    if (!video || !video.textTracks) return;

    for (let i = 0; i < video.textTracks.length; i++) {
      const track = video.textTracks[i];
      if (sub.id === "off") {
        track.mode = "disabled";
      } else if (sub.trackIndex !== undefined && i === sub.trackIndex) {
        track.mode = "showing";
      } else {
        track.mode = "disabled";
      }
    }
  };

  // Switch Server Source
  const handleSourceSelect = (source: StreamSource) => {
    setActiveSource(source);
    setIsFinished(false);
  };

  const backUrl =
    mediaType === "movie" ? `/movie/${tmdbId}` : `/tv/${tmdbId}`;

  const currentPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleUserActivity}
      onClick={handleUserActivity}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl select-none group/player"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        crossOrigin="anonymous"
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        playsInline
      >
        {/* Subtitle tracks */}
        {subtitles.map((sub, index) => (
          <track
            key={sub.id || index}
            src={sub.url}
            kind="subtitles"
            label={sub.label}
            srcLang={sub.language || "en"}
            default={sub.default}
          />
        ))}
      </video>

      {/* Buffering Indicator */}
      {isBuffering && !playerError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none z-20">
          <Loader2 className="w-12 h-12 text-[#e50914] animate-spin" />
        </div>
      )}

      {/* Error Overlay */}
      {playerError && (
        <div className="absolute inset-0 z-30 bg-black/90 flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">Stream Error</h3>
            <p className="text-xs text-zinc-400">{playerError}</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setupStream(activeSource)}
                className="px-4 py-2 bg-[#e50914] text-white text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-[#f40612]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
              <Link
                href={backUrl}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-700"
              >
                Back to Details
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Next Episode Overlay */}
      {isFinished && nextEpisodeUrl && nextEpisodeNumber && (
        <NextEpisodeOverlay
          nextEpisodeUrl={nextEpisodeUrl}
          nextEpisodeNumber={nextEpisodeNumber}
          nextEpisodeTitle={nextEpisodeTitle}
          onReplay={() => {
            setIsFinished(false);
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              videoRef.current.play().catch(() => {});
            }
          }}
        />
      )}

      {/* Top Header Overlay (Back Button & Title) */}
      <div
        className={`absolute top-0 left-0 right-0 z-30 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={backUrl}
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors"
              title="Back to Details"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white line-clamp-1 drop-shadow">
                {title}
              </h2>
              {mediaType === "tv" && (
                <p className="text-xs text-zinc-400 line-clamp-1">
                  Season {season} Episode {episode}{" "}
                  {episodeTitle ? `• ${episodeTitle}` : ""}
                </p>
              )}
            </div>
          </div>

          {/* Server Switcher on Header */}
          <ServerSelector
            sources={sources}
            activeSourceId={activeSource.id}
            onSelectSource={handleSourceSelect}
          />
        </div>
      </div>

      {/* Bottom Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="space-y-3">
          {/* Progress Seek Bar */}
          <div className="relative group/seekbar flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeekChange}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer focus:outline-none"
              style={{
                background: `linear-gradient(to right, #e50914 ${currentPercent}%, rgba(255,255,255,0.2) ${currentPercent}%)`,
              }}
            />
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-white">
            {/* Left Controls: Play, Skip, Volume, Time */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-white text-black hover:bg-white/90 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                title={isPlaying ? "Pause (Space)" : "Play (Space)"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-black" />
                ) : (
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                )}
              </button>

              {/* Seek Back 10s */}
              <button
                onClick={() => seekBy(-10)}
                className="p-1.5 text-zinc-300 hover:text-white transition-colors"
                title="Rewind 10s (←)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Seek Forward 10s */}
              <button
                onClick={() => seekBy(10)}
                className="p-1.5 text-zinc-300 hover:text-white transition-colors"
                title="Forward 10s (→)"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5 group/volume">
                <button
                  onClick={toggleMute}
                  className="p-1.5 text-zinc-300 hover:text-white transition-colors"
                  title="Mute (M)"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-500" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => changeVolume(parseFloat(e.target.value))}
                  className="w-14 sm:w-20 h-1 bg-white/20 rounded cursor-pointer"
                />
              </div>

              {/* Time Display */}
              <div className="text-xs font-mono text-zinc-400 pl-2">
                <span>{formatTime(currentTime)}</span>
                <span className="mx-1">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right Controls: Quality, Audio, Subtitles, Speed, PiP, Fullscreen */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Quality Selector */}
              <QualitySelector
                qualities={availableQualities}
                currentQualityId={selectedQualityId}
                onSelectQuality={handleQualitySelect}
              />

              {/* Audio Selector */}
              <AudioSelector
                audioTracks={availableAudioTracks}
                currentAudioId={selectedAudioId}
                onSelectAudio={handleAudioSelect}
              />

              {/* Subtitle Selector */}
              <SubtitleSelector
                subtitles={availableSubtitles}
                currentSubtitleId={selectedSubtitleId}
                onSelectSubtitle={handleSubtitleSelect}
              />

              {/* Playback Speed Menu */}
              <div className="relative">
                <button
                  onClick={() => setSpeedMenuOpen(!speedMenuOpen)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-black/60 hover:bg-white/20 text-zinc-300 hover:text-white text-xs font-semibold backdrop-blur-md transition-colors border border-white/10"
                  title="Playback Speed"
                >
                  <Gauge className="w-3.5 h-3.5 text-zinc-300" />
                  <span>{playbackSpeed}x</span>
                </button>

                {speedMenuOpen && (
                  <div className="absolute bottom-full right-0 mb-2 w-28 bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl overflow-hidden z-50 py-1">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => handleSpeedChange(spd)}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                          playbackSpeed === spd
                            ? "text-[#e50914] font-bold bg-white/5"
                            : "text-zinc-300 hover:bg-white/10"
                        }`}
                      >
                        {spd === 1 ? "Normal (1x)" : `${spd}x`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Picture in Picture */}
              {typeof document !== "undefined" &&
                document.pictureInPictureEnabled && (
                  <button
                    onClick={togglePiP}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                    title="Picture in Picture"
                  >
                    <PictureInPicture2 className="w-4 h-4" />
                  </button>
                )}

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                title={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

