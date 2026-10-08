"use client";

import React, { useState, useRef, useEffect } from "react";
import { Settings, Check } from "lucide-react";

export interface QualityOption {
  id: string; // e.g. "auto", "1080p", "720p", "480p"
  label: string; // e.g. "Auto (1080p)", "1080p (FHD)", "720p (HD)"
  levelIndex?: number; // for HLS level index
}

interface QualitySelectorProps {
  qualities: QualityOption[];
  currentQualityId: string;
  onSelectQuality: (quality: QualityOption) => void;
}

export function QualitySelector({
  qualities,
  currentQualityId,
  onSelectQuality,
}: QualitySelectorProps) {
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

  if (!qualities || qualities.length <= 1) {
    // If only one quality or none, display its badge without a dropdown
    const singleLabel = qualities?.[0]?.label || "Auto";
    return (
      <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 text-zinc-300 text-xs font-medium cursor-default">
        <Settings className="w-3.5 h-3.5 text-zinc-400" />
        <span>{singleLabel}</span>
      </div>
    );
  }

  const activeOption =
    qualities.find((q) => q.id === currentQualityId) || qualities[0];

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-white/20 text-zinc-200 text-xs font-semibold backdrop-blur-md transition-colors border border-white/10"
        title="Video Quality"
      >
        <Settings className="w-3.5 h-3.5 text-zinc-300" />
        <span>{activeOption.label}</span>
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-2 w-40 bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl overflow-hidden z-50 py-1 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
            Quality
          </div>
          {qualities.map((q) => {
            const isSelected = q.id === currentQualityId;
            return (
              <button
                key={q.id}
                onClick={() => {
                  onSelectQuality(q);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-white/10 transition-colors ${isSelected ? "text-[#e50914] font-bold bg-white/5" : "text-zinc-200"
                  }`}
              >
                <span>{q.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

