"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, Check } from "lucide-react";

export interface AudioTrackOption {
  id: string; // e.g. "en", "hi", "0", "1"
  label: string; // e.g. "English", "Hindi", "Original"
  hlsTrackIndex?: number;
}

interface AudioSelectorProps {
  audioTracks: AudioTrackOption[];
  currentAudioId: string;
  onSelectAudio: (track: AudioTrackOption) => void;
}

export function AudioSelector({
  audioTracks,
  currentAudioId,
  onSelectAudio,
}: AudioSelectorProps) {
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

  // Section 13: If there are no multiple audio tracks, hide the language selector.
  if (!audioTracks || audioTracks.length <= 1) {
    return null;
  }

  const activeTrack =
    audioTracks.find((t) => t.id === currentAudioId) || audioTracks[0];

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-white/20 text-zinc-200 text-xs font-semibold backdrop-blur-md transition-colors border border-white/10"
        title="Audio Track"
      >
        <Volume2 className="w-3.5 h-3.5 text-zinc-300" />
        <span>{activeTrack.label}</span>
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-2 w-40 bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl overflow-hidden z-50 py-1 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
            Audio Track
          </div>
          {audioTracks.map((track) => {
            const isSelected = track.id === currentAudioId;
            return (
              <button
                key={track.id}
                onClick={() => {
                  onSelectAudio(track);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-white/10 transition-colors ${
                  isSelected ? "text-[#e50914] font-bold bg-white/5" : "text-zinc-200"
                }`}
              >
                <span>{track.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

