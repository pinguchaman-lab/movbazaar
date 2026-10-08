"use client";

import React, { useState, useRef, useEffect } from "react";
import { Server, Check, ChevronDown } from "lucide-react";
import { StreamSource } from "@/types/omss";

interface ServerSelectorProps {
  sources: StreamSource[];
  activeSourceId: string;
  onSelectSource: (source: StreamSource) => void;
}

export function ServerSelector({
  sources,
  activeSourceId,
  onSelectSource,
}: ServerSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!sources || sources.length <= 1) {
    return null;
  }

  const active =
    sources.find((s) => s.id === activeSourceId) || sources[0];

  const getLabel = (s: StreamSource, index: number) => {
    const name = s.provider?.name || `Server ${index + 1}`;
    const quality = s.quality ? ` • ${s.quality}` : "";
    return `${name}${quality}`;
  };

  return (
    <div ref={containerRef} className="relative z-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-zinc-850 text-zinc-100 text-xs font-semibold backdrop-blur-md transition-all border border-white/20 hover:border-white/40 shadow-lg"
        title="Change Streaming Server"
      >
        <Server className="w-3.5 h-3.5 text-[#e50914] flex-shrink-0" />
        <span className="truncate max-w-[130px] sm:max-w-[200px]">
          {getLabel(active, sources.indexOf(active))}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-zinc-950/95 backdrop-blur-xl border border-zinc-700/90 rounded-2xl shadow-2xl z-50 p-1.5 animate-in fade-in slide-in-from-top-2 duration-150 scrollbar-none">
          <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800/80 flex items-center justify-between">
            <span>Select Stream Server</span>
            <span className="text-[9px] text-[#e50914] font-semibold">
              {sources.length} Available
            </span>
          </div>
          <div className="space-y-1 pt-1">
            {sources.map((s, idx) => {
              const isSelected = s.id === activeSourceId;
              const providerName = s.provider?.name || `Server ${idx + 1}`;
              const quality = s.quality || "Auto";
              const isEmbed = s.type === "embed";

              return (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectSource(s);
                    setOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                    isSelected
                      ? "bg-[#e50914]/15 border border-[#e50914]/40 text-white font-bold"
                      : "hover:bg-zinc-800/70 text-zinc-300 hover:text-white border border-transparent"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="truncate">{providerName}</span>
                      {s.type === "hls" && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[8px] font-bold">
                          Multi-Audio
                        </span>
                      )}
                      {(s.id.includes("autoembed") || s.id.includes("vidsrc-pm")) && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[8px] font-bold">
                          99.9% Uptime
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-zinc-400 font-normal">
                      <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-200 font-mono text-[9px]">
                        {quality}
                      </span>
                      <span>•</span>
                      <span className="text-zinc-500">
                        {isEmbed ? "Web Stream" : "HLS Direct"}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-[#e50914] stroke-[2.5] flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

