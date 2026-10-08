"use client";

import React, { useState } from "react";
import { Server, Sparkles, Check, Info, Volume2, Globe, HelpCircle } from "lucide-react";
import { StreamSource } from "@/types/omss";

interface ServerSelectorBarProps {
  sources: StreamSource[];
  activeSourceId: string;
  onSelectSource: (source: StreamSource) => void;
  isUpcoming?: boolean;
}

export function ServerSelectorBar({
  sources,
  activeSourceId,
  onSelectSource,
  isUpcoming = false,
}: ServerSelectorBarProps) {
  const [filter, setFilter] = useState<"all" | "hindi" | "fast" | "loud">("all");
  const [showHindiGuide, setShowHindiGuide] = useState(false);
  const [showVolumeGuide, setShowVolumeGuide] = useState(false);

  if (!sources || sources.length === 0) return null;

  const activeIndex = sources.findIndex((s) => s.id === activeSourceId);
  const activeSource = sources[activeIndex >= 0 ? activeIndex : 0];

  // Filter sources based on user preference
  const filteredSources = sources.filter((s) => {
    if (filter === "hindi") {
      const isDualAudio =
        s.id.includes("vidlink") ||
        s.audioTracks?.includes("Hindi") ||
        s.audioTracks?.includes("Multi");
      return isDualAudio;
    }
    if (filter === "fast") {
      return (
        s.id.includes("vidlink") ||
        s.id.includes("vidsrc-pm") ||
        s.id.includes("vidsrc-su") ||
        s.id.includes("autoembed")
      );
    }
    if (filter === "loud") {
      return (
        s.id.includes("vidlink") ||
        s.id.includes("autoembed") ||
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
                Streaming Servers
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                {sources.length} Mirrors
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Switch mirrors instantly if any stream buffers, lacks audio, or has latency
            </p>
          </div>
        </div>

        {/* Active Server Pill & Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
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
              onClick={() => setFilter("hindi")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                filter === "hindi"
                  ? "bg-amber-600 text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>Hindi / Dual</span>
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
            onClick={() => {
              setShowVolumeGuide(!showVolumeGuide);
              if (showHindiGuide) setShowHindiGuide(false);
            }}
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

          <button
            onClick={() => {
              setShowHindiGuide(!showHindiGuide);
              if (showVolumeGuide) setShowVolumeGuide(false);
            }}
            className="p-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-white transition-colors border border-zinc-700/60"
            title="How Multi-Audio / Hindi Audio Works"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

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
              <strong>Switch to High-Gain Servers:</strong> Some servers stream raw 5.1 cinema surround sound where vocal dialogue is quiet on laptop/mobile speakers. Select <strong className="text-amber-300">Server 1 (VidLink)</strong> or <strong className="text-emerald-300">Server 4 (AutoEmbed)</strong> for loud stereo mastered audio.
            </li>
            <li>
              <strong>Change Audio Track:</strong> Inside Server 1&apos;s settings (gear icon inside video), switching audio tracks (e.g. Stereo, Dual Audio, or English Stereo) provides amplified dialogue.
            </li>
            <li>
              <strong>Native Player Booster:</strong> When watching via direct stream, press <strong className="text-amber-300">B</strong> or click the <strong className="text-amber-300">Boost (150% - 300%)</strong> button next to the volume slider to amplify quiet audio.
            </li>
          </ul>
        </div>
      )}

      {/* Multi-Audio & Hindi Dubbing Guide Banner */}
      {showHindiGuide && (
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs space-y-1.5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>How to access Hindi &amp; Multi-Language Audio:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-300 pl-1">
            <li>
              <strong>Hollywood &amp; International Titles:</strong> Select{" "}
              <strong className="text-amber-300">VidLink (Server 1)</strong>.
              Inside the video player screen, click the <strong>Settings / Audio Track</strong> menu{" "}
              to toggle between Original English and Hindi/Dual Audio dubbing.
            </li>
            <li>
              <strong>Bollywood &amp; Indian Cinema:</strong> Native Hindi audio is active by default across all verified servers.
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
          const hasHindi =
            s.audioTracks?.includes("Hindi") ||
            (s.id.includes("vidlink") && s.audioTracks?.includes("Hindi"));
          const hasMulti =
            s.audioTracks?.includes("Multi") ||
            s.id.includes("vidlink") ||
            s.id.includes("vidsrc-pm");

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
              <div className="flex items-center justify-between gap-1 text-[10px] font-mono opacity-85 pt-0.5">
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                    isSelected
                      ? "bg-black/30 text-white"
                      : "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  {quality}
                </span>

                {hasHindi ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/25 text-amber-300 border border-amber-500/30">
                    Dual Audio
                  </span>
                ) : s.id.includes("autoembed") ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Loud Audio
                  </span>
                ) : hasMulti ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Multi
                  </span>
                ) : (
                  <span className="text-[9px] capitalize text-zinc-400">
                    {s.type === "embed" ? "Fast Embed" : "HLS Direct"}
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
          <strong className="text-white font-semibold">Playback &amp; Audio Tip:</strong> If your chosen server buffers, has low volume, or lacks audio, simply select another mirror above (<span className="text-amber-300 font-semibold">Server 1 or Server 4</span> for loudest audio) — each server connects to an independent high-speed network.
        </p>
      </div>
    </div>
  );
}
