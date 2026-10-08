"use client";

import React, { useState } from "react";
import {
  Server,
  Sparkles,
  Check,
  Info,
  Volume2,
  Globe,
  RefreshCw,
} from "lucide-react";
import { StreamSource } from "@/types/omss";

interface ServerSelectorBarProps {
  sources: StreamSource[];
  activeSourceId: string;
  onSelectSource: (source: StreamSource) => void;
  isUpcoming?: boolean;
  originalLanguage?: string;
}

export function ServerSelectorBar({
  sources,
  activeSourceId,
  onSelectSource,
  isUpcoming = false,
  originalLanguage,
}: ServerSelectorBarProps) {
  const isHindi = originalLanguage === "hi";
  const isHollywood = originalLanguage === "en";
  const isSouthIndian = Boolean(
    originalLanguage && ["te", "ta", "ml", "kn"].includes(originalLanguage)
  );

  const [audioMode, setAudioMode] = useState<"all" | "hindi" | "english">(
    isHindi ? "hindi" : isHollywood ? "english" : "all"
  );
  const [filter, setFilter] = useState<"all" | "loud" | "fast">("all");
  const [showVolumeGuide, setShowVolumeGuide] = useState(false);

  if (!sources || sources.length === 0) return null;

  const activeIndex = sources.findIndex((s) => s.id === activeSourceId);
  const activeSource = sources[activeIndex >= 0 ? activeIndex : 0];

  const handleNextServer = () => {
    if (!sources || sources.length === 0) return;
    const currentIdx = sources.findIndex((s) => s.id === activeSourceId);
    const nextIdx = (currentIdx + 1) % sources.length;
    onSelectSource(sources[nextIdx]);
  };

  const getLangName = (code?: string) => {
    switch (code) {
      case "te":
        return "Telugu (తెలుగు)";
      case "ta":
        return "Tamil (தமிழ்)";
      case "ml":
        return "Malayalam (മലയാളം)";
      case "kn":
        return "Kannada (ಕನ್ನಡ)";
      case "hi":
        return "Hindi (हिंदी)";
      case "en":
        return "English";
      case "ko":
        return "Korean (한국어)";
      case "ja":
        return "Japanese (日本語)";
      default:
        return code?.toUpperCase() || "Original";
    }
  };

  const handleAudioModeChange = (mode: "all" | "hindi" | "english") => {
    setAudioMode(mode);
    if (mode === "hindi") {
      const hindiSource = sources.find(
        (s) =>
          s.id.includes("autoembed") ||
          s.id.includes("vidlink") ||
          s.id.includes("vidcore") ||
          s.audioTracks?.includes("Hindi") ||
          s.audioTracks?.includes("Multi")
      );
      if (hindiSource && hindiSource.id !== activeSourceId) {
        onSelectSource(hindiSource);
      }
    } else if (mode === "english") {
      const origSource = sources.find(
        (s) =>
          s.id.includes("autoembed") ||
          s.id.includes("vidsrc-pm") ||
          s.id.includes("vidsrc-su") ||
          s.id.includes("vidcore") ||
          s.id.includes("2embed") ||
          s.id.includes("vidlink")
      );
      if (origSource && origSource.id !== activeSourceId) {
        onSelectSource(origSource);
      }
    }
  };

  // Filter sources based on user preference and audio language mode
  const filteredSources = sources.filter((s) => {
    if (audioMode === "hindi") {
      const isDualAudio =
        s.id.includes("autoembed") ||
        s.id.includes("vidlink") ||
        s.id.includes("vidcore") ||
        s.audioTracks?.includes("Hindi") ||
        s.audioTracks?.includes("Multi");
      if (!isDualAudio) return false;
    } else if (audioMode === "english") {
      const isOriginal =
        s.id.includes("autoembed") ||
        s.id.includes("vidsrc-pm") ||
        s.id.includes("vidsrc-su") ||
        s.id.includes("vidsrc-sh") ||
        s.id.includes("vidcore") ||
        s.id.includes("2embed") ||
        s.id.includes("2embed-skin") ||
        s.id.includes("vidfast") ||
        s.id.includes("vidlink") ||
        s.audioTracks?.includes("Original") ||
        s.audioTracks?.includes("English");
      if (!isOriginal) return false;
    }

    if (filter === "fast") {
      return (
        s.id.includes("autoembed") ||
        s.id.includes("vidlink") ||
        s.id.includes("vidcore") ||
        s.id.includes("vidsrc-pm") ||
        s.id.includes("vidsrc-su") ||
        s.id.includes("2embed") ||
        s.id.includes("multiembed")
      );
    }
    if (filter === "loud") {
      return (
        s.id.includes("autoembed") ||
        s.id.includes("vidlink") ||
        s.id.includes("vidcore") ||
        s.id.includes("multiembed") ||
        s.type === "hls"
      );
    }
    return true;
  });

  return (
    <div className="w-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800/90 rounded-2xl p-3.5 sm:p-5 space-y-3.5 shadow-xl select-none">
      {/* Top Header of Server Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#e50914]/15 border border-[#e50914]/30 flex items-center justify-center flex-shrink-0">
            <Server className="w-4 h-4 text-[#e50914]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase">
                Streaming Servers &amp; Dubs
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                {sources.length} Mirrors
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Switch between Hindi Dubbed and Original studio audio across independent mirrors
            </p>
          </div>
        </div>

        {/* Active Server Pill, Quick Switcher & Quick Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick-Switch Button: cycles to next mirror immediately */}
          <button
            onClick={handleNextServer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white text-[11px] sm:text-xs font-bold shadow-md hover:shadow-red-600/30 transition-all active:scale-95 group cursor-pointer"
            title="If this server shows 'Not Found' or fails, click to switch to the next live mirror"
          >
            <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
            <span>Server Not Working? Try Next</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-950/70 border border-zinc-800 text-[11px] text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-400">Active:</span>
            <span className="font-semibold text-white truncate max-w-[130px]">
              {activeSource?.provider?.name || "Server 1"}
            </span>
          </div>

          <div className="flex items-center bg-zinc-950/80 p-0.5 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                filter === "all"
                  ? "bg-[#e50914] text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("loud")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                filter === "loud"
                  ? "bg-amber-600 text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Filter servers with loud, amplified sound masters"
            >
              <Volume2 className="w-3 h-3 text-amber-300" />
              <span>Loud Audio</span>
            </button>
            <button
              onClick={() => setFilter("fast")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                filter === "fast"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Ultra Fast
            </button>
          </div>

          <button
            onClick={() => setShowVolumeGuide(!showVolumeGuide)}
            className={`px-2 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              showVolumeGuide
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-white border-zinc-700/60"
            }`}
            title="Low Sound / Audio Troubleshooting Guide"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] hidden sm:inline">Low Sound?</span>
          </button>
        </div>
      </div>

      {/* Audio Language Information Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-zinc-950/90 border border-zinc-800">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#e50914]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Audio Soundtrack:
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            {isHindi
              ? "Indian Cinema / Series — 100% Native Hindi dialogue audio"
              : isHollywood
              ? "Hollywood Release — Original Studio English with Multi-Language Subtitles (CC)"
              : `International Release — ${getLangName(originalLanguage)} Original Audio`}
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto flex-wrap">
          {isHindi ? (
            <div className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-lg shadow-red-950/60 ring-1 ring-amber-400 flex items-center gap-1.5">
              <span>🇮🇳 Native Hindi Audio</span>
            </div>
          ) : isHollywood ? (
            <>
              <div className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-950/80 text-sky-200 border border-sky-600/50 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>🌐 English (Original Audio)</span>
              </div>
              <div className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-300">
                <span>💬 Subtitles (CC in Player)</span>
              </div>
            </>
          ) : (
            <>
              <div className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-950/80 text-purple-200 border border-purple-600/50">
                <span>{getLangName(originalLanguage)} (Original)</span>
              </div>
              <button
                onClick={() => handleAudioModeChange("all")}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white"
              >
                <span>All Mirrors ({sources.length})</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hollywood Title Context Notice */}
      {isHollywood && (
        <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-800/40 text-sky-200 text-xs flex items-start gap-2.5">
          <Globe className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-sky-300 flex items-center gap-1.5">
              <span>Hollywood International Title: Original English Sound</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              This film streams in its <strong>original studio English master</strong> with crystal-clear audio. To read subtitles, click the <strong>CC / Subtitles icon</strong> inside the video player. Free third-party streaming CDNs provide original English masters for international cinema and do not offer secondary in-player Hindi audio dubbing.
            </p>
          </div>
        </div>
      )}

      {/* Hindi Native Notice */}
      {isHindi && (
        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-300">
              Indian Cinema &amp; Series: 100% Hindi Audio
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              All servers stream this title natively in <strong>Hindi dialogue</strong> with full audio fidelity across all available mirrors.
            </p>
          </div>
        </div>
      )}

      {/* South Indian Context Notice */}
      {isSouthIndian && (
        <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-800/40 text-orange-200 text-xs flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-orange-300 flex items-center gap-1.5 flex-wrap">
              <span>South Indian Film: {getLangName(originalLanguage)}</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              This title was originally filmed in {getLangName(originalLanguage)}. Servers provide high-definition streaming with subtitles. If a server indexes an Indian dubbed release, it will be loaded automatically.
            </p>
          </div>
        </div>
      )}

      {/* Volume & Low Sound Troubleshooting Banner */}
      {showVolumeGuide && (
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-indigo-200 text-xs space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold text-indigo-300">
            <Volume2 className="w-4 h-4 text-indigo-400" />
            <span>Low Stream Volume on Some Servers? Quick Fixes:</span>
          </div>
          <ul className="list-disc list-inside space-y-1.5 text-[11px] text-zinc-300 pl-1 leading-relaxed">
            <li>
              <strong>Internal Player Slider:</strong> Embedded players inside the video window often default to 50% volume. Hover or tap the video player, find the speaker slider next to the play button, and drag it to 100%.
            </li>
            <li>
              <strong>Switch to High-Gain Servers:</strong> Some servers stream raw 5.1 cinema surround sound where vocal dialogue is quiet on laptop/mobile speakers. Select <strong className="text-amber-300">Server 1 (AutoEmbed)</strong> or <strong className="text-emerald-300">Server 2 (VidLink)</strong> for loud stereo mastered audio.
            </li>
            <li>
              <strong>Native Player Booster:</strong> When watching via direct stream, press <strong className="text-amber-300">B</strong> or click the <strong className="text-amber-300">Boost (150% - 300%)</strong> button next to the volume slider to amplify quiet audio.
            </li>
          </ul>
        </div>
      )}

      {/* Pre-Release Banner for Unreleased Titles */}
      {isUpcoming && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-amber-300">
              Pre-Release Title Notice:
            </span>
            <p className="text-[11px] text-zinc-300">
              This film has not officially premiered in theaters or on digital platforms yet.
              Server 1 is streaming the official HD trailer. Alternate mirrors are also available below.
            </p>
          </div>
        </div>
      )}

      {/* Responsive Server Buttons Grid (2 cols mobile, 3 tablet, 4 desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5 pt-0.5">
        {(filteredSources.length > 0 ? filteredSources : sources).map((s, idx) => {
          const isSelected = s.id === activeSourceId;
          const providerName = s.provider?.name || `Server ${idx + 1}`;
          const quality = s.quality || "1080p";
          const isTrailer = s.id.includes("trailer");
          const isNativeHls = s.type === "hls";
          const isHighUptime =
            s.id.includes("autoembed") || s.id.includes("vidsrc-pm");

          return (
            <button
              key={s.id}
              onClick={() => onSelectSource(s)}
              className={`min-h-[72px] sm:min-h-[80px] p-2.5 sm:p-3 rounded-xl text-left transition-all relative overflow-hidden flex flex-col justify-between gap-1 group active:scale-[0.98] ${
                isSelected
                  ? "bg-[#e50914] text-white shadow-lg shadow-red-950/60 ring-2 ring-red-500/60"
                  : "bg-zinc-950/70 hover:bg-zinc-800/90 text-zinc-300 hover:text-white border border-zinc-800/80 hover:border-zinc-700"
              }`}
            >
              {/* Header inside button */}
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 flex items-center gap-1 truncate">
                  {isTrailer ? (
                    <span className="flex items-center gap-1 text-amber-300">
                      <Sparkles className="w-3 h-3" />
                      <span>Trailer</span>
                    </span>
                  ) : (
                    `Server ${sources.indexOf(s) + 1}`
                  )}
                </span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />
                )}
              </div>

              {/* Provider Name */}
              <div className="min-w-0 py-0.5">
                <div className="text-xs sm:text-xs font-bold truncate leading-tight">
                  {providerName}
                </div>
              </div>

              {/* Audio & Quality Tags */}
              <div className="flex items-center justify-between gap-1 text-[10px] font-mono opacity-85 pt-0.5 flex-wrap">
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                    isSelected
                      ? "bg-black/30 text-white"
                      : "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  {quality}
                </span>

                {isHighUptime && (
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    🟢 99.9%
                  </span>
                )}

                {isHindi ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/25 text-amber-300 border border-amber-500/30">
                    🇮🇳 Hindi
                  </span>
                ) : isHollywood ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    🌐 English + CC
                  </span>
                ) : isNativeHls ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Multi-Track
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {getLangName(originalLanguage)}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Server Redundancy & Fallback Guidance Notice */}
      <div className="flex items-start sm:items-center gap-2.5 text-xs text-zinc-300 bg-zinc-950/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 mt-2">
        <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          <strong className="text-white font-semibold">Playback &amp; Audio Tip:</strong> If any server displays &quot;Not Found&quot; or buffers, click <span className="text-amber-300 font-semibold">&quot;Server Not Working? Try Next&quot;</span> above or select any mirror (<span className="text-amber-300 font-semibold">Server 1, 2, 3, or 4</span>) — all 10 servers run on separate global high-speed CDN networks.
        </p>
      </div>
    </div>
  );
}
