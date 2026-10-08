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
  const [filter, setFilter] = useState<"all" | "hindi" | "fast">("all");
  const [showHindiGuide, setShowHindiGuide] = useState(false);

  if (!sources || sources.length === 0) return null;

  const activeIndex = sources.findIndex((s) => s.id === activeSourceId);
  const activeSource = sources[activeIndex >= 0 ? activeIndex : 0];

  // Filter sources based on user preference
  const filteredSources = sources.filter((s) => {
    if (filter === "hindi") {
      const isDualAudio =
        s.id.includes("superembed") ||
        s.id.includes("vidlink") ||
        s.audioTracks?.includes("Hindi") ||
        s.audioTracks?.includes("Multi");
      return isDualAudio;
    }
    if (filter === "fast") {
      return (
        s.id.includes("vidlink") ||
        s.id.includes("vidsrc-pm") ||
        s.id.includes("autoembed")
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
              onClick={() => setFilter("hindi")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                filter === "hindi"
                  ? "bg-amber-600 text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>Hindi / Dual Audio</span>
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
            onClick={() => setShowHindiGuide(!showHindiGuide)}
            className="p-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-white transition-colors border border-zinc-700/60"
            title="How Multi-Audio / Hindi Audio Works"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Multi-Audio & Hindi Dubbing Guide Banner */}
      {showHindiGuide && (
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs space-y-1.5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>How to access Hindi & Multi-Language Audio:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-300 pl-1">
            <li>
              <strong>Hollywood / International Movies:</strong> Switch to{" "}
              <strong className="text-amber-300">SuperEmbed (Server 2)</strong>{" "}
              or <strong className="text-amber-300">VidLink (Server 1)</strong>.
              Inside the video player, click the <strong>Settings (Gear ⚙)</strong>{" "}
              or <strong>Server Menu</strong> at the bottom/top of the video to toggle
              between English and Hindi/Dual Audio tracks.
            </li>
            <li>
              <strong>Bollywood & Indian Cinema:</strong> Audio is already in
              Hindi by default across all servers.
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
            s.id.includes("superembed") ||
            s.audioTracks?.includes("Hindi");
          const hasMulti =
            s.audioTracks?.includes("Multi") ||
            s.id.includes("vidlink");

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
    </div>
  );
}
