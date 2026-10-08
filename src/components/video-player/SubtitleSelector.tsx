"use client";

import React, { useState, useRef, useEffect } from "react";
import { Subtitles, Check } from "lucide-react";

export interface SubtitleOption {
  id: string; // "off" or subtitle id / index
  label: string; // "Off", "English", etc.
  url?: string;
  trackIndex?: number;
}

interface SubtitleSelectorProps {
  subtitles: SubtitleOption[];
  currentSubtitleId: string;
  onSelectSubtitle: (sub: SubtitleOption) => void;
}

export function SubtitleSelector({
  subtitles,
  currentSubtitleId,
  onSelectSubtitle,
}: SubtitleSelectorProps) {
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

  // If no subtitles available beyond "Off", hide or show disabled
  if (!subtitles || subtitles.length <= 1) {
    return null;
  }

  const activeSub =
    subtitles.find((s) => s.id === currentSubtitleId) || subtitles[0];

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md transition-colors border ${currentSubtitleId !== "off"
          ? "bg-[#e50914]/20 border-[#e50914]/50 text-white"
          : "bg-black/60 hover:bg-white/20 border-white/10 text-zinc-300"
          }`}
        title="Subtitles (CC)"
      >
        <Subtitles className="w-3.5 h-3.5 text-zinc-300" />
        <span>{activeSub.id === "off" ? "CC" : activeSub.label}</span>
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-2 w-40 bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl overflow-hidden z-50 py-1 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
            Subtitles
          </div>
          {subtitles.map((sub) => {
            const isSelected = sub.id === currentSubtitleId;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  onSelectSubtitle(sub);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-white/10 transition-colors ${isSelected ? "text-[#e50914] font-bold bg-white/5" : "text-zinc-200"
                  }`}
              >
                <span>{sub.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

