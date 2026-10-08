"use client";

import React, { useState, useRef, useEffect } from "react";
import { Server, Check } from "lucide-react";
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
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-white/20 text-zinc-200 text-xs font-semibold backdrop-blur-md transition-colors border border-white/10"
        title="Streaming Server"
      >
        <Server className="w-3.5 h-3.5 text-zinc-300" />
        <span>{getLabel(active, sources.indexOf(active))}</span>
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-2 w-52 bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl overflow-hidden z-50 py-1 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
            Available Servers
          </div>
          {sources.map((s, idx) => {
            const isSelected = s.id === activeSourceId;
            return (
              <button
                key={s.id}
                onClick={() => {
                  onSelectSource(s);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-white/10 transition-colors ${
                  isSelected ? "text-[#e50914] font-bold bg-white/5" : "text-zinc-200"
                }`}
              >
                <div>
                  <div>{s.provider?.name || `Server ${idx + 1}`}</div>
                  <div className="text-[10px] text-zinc-400 font-normal">
                    {s.quality || "Auto"} {s.audioTracks ? `• ${s.audioTracks.join(", ")}` : ""}
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

