"use client";

import React from "react";
import { Server, Sparkles, Check, Info } from "lucide-react";
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
  if (!sources || sources.length === 0) return null;

  const activeIndex = sources.findIndex((s) => s.id === activeSourceId);
  const activeSource = sources[activeIndex >= 0 ? activeIndex : 0];

  return (
    <div className="w-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800/90 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-xl">
      {/* Top Header of Server Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/70 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#e50914]/15 border border-[#e50914]/30 flex items-center justify-center">
            <Server className="w-4 h-4 text-[#e50914]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase">
                Streaming Servers
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                {sources.length} Mirrors
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Switch mirrors instantly if any stream buffers or experiences provider latency
            </p>
          </div>
        </div>

        {/* Active server status pill */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-400 hidden md:inline">
            Active:
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-800/90 border border-zinc-700/80 text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{activeSource?.provider?.name || "Server 1"}</span>
          </span>
        </div>
      </div>

      {/* Unreleased Title Banner */}
      {isUpcoming && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-amber-300">
              Pre-Release Title Notice:
            </span>
            <p className="text-[11px] text-zinc-300">
              This film has not officially premiered in theaters or on digital platforms yet.
              Server 1 is streaming the official HD trailer. You can also test alternate mirrors below.
            </p>
          </div>
        </div>
      )}

      {/* Server Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 pt-1">
        {sources.map((s, idx) => {
          const isSelected = s.id === activeSourceId;
          const providerName = s.provider?.name || `Server ${idx + 1}`;
          const quality = s.quality || "1080p";
          const isTrailer = s.id.includes("trailer");

          return (
            <button
              key={s.id}
              onClick={() => onSelectSource(s)}
              className={`p-2.5 rounded-xl text-left transition-all relative overflow-hidden flex flex-col justify-between gap-1.5 group ${
                isSelected
                  ? "bg-[#e50914] text-white shadow-lg shadow-red-950/60 ring-2 ring-red-500/50"
                  : "bg-zinc-950/60 hover:bg-zinc-800/90 text-zinc-300 hover:text-white border border-zinc-800/80 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 flex items-center gap-1">
                  {isTrailer ? (
                    <Sparkles className="w-3 h-3 text-amber-300" />
                  ) : (
                    `Server ${idx + 1}`
                  )}
                </span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />
                )}
              </div>

              <div className="min-w-0">
                <div className="text-xs font-bold truncate leading-snug">
                  {providerName}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono opacity-80 pt-0.5">
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                    isSelected
                      ? "bg-black/30 text-white"
                      : "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  {quality}
                </span>
                <span className="text-[9px] capitalize">
                  {s.type === "embed" ? "Fast Embed" : "HLS Direct"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
