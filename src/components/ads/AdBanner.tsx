"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, X, Zap, ArrowRight } from "lucide-react";

interface AdBannerProps {
  slot?: "player-bottom" | "catalog-header" | "home-middle" | "default";
  className?: string;
}

export function AdBanner({ slot = "default", className = "" }: AdBannerProps) {
  const { isVip, openLoginModal } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);

  // If user is a verified VIP with admin-issued credentials: ZERO ads rendered!
  if (isVip) {
    return null;
  }

  if (isDismissed) {
    return null;
  }

  if (slot === "player-bottom") {
    return (
      <div
        className={`w-full bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl select-none ${className}`}
      >
        <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono uppercase tracking-wider font-bold">
                Sponsored Ad
              </span>
              <span className="text-xs font-bold text-white">
                Streaming in Guest Mode
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Enter your MovBazaar VIP pass to unlock 100% Ad-Free uninterrupted streaming.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={openLoginModal}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#e50914] hover:bg-[#b80710] text-white text-xs font-bold shadow-lg shadow-red-950/60 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Remove Ads (VIP Login)</span>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-colors"
            title="Hide for this session"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full bg-zinc-900/50 border border-zinc-800/70 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs select-none ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono uppercase tracking-wider font-semibold">
          Ad
        </span>
        <div className="truncate">
          <span className="font-semibold text-zinc-200">
            Enjoying MovBazaar?
          </span>{" "}
          <span className="text-zinc-400 hidden sm:inline">
            Log in with your VIP credentials for 100% ad-free viewing.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={openLoginModal}
          className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <span>VIP Login</span>
          <ArrowRight className="w-3 h-3" />
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-zinc-600 hover:text-zinc-400 p-1"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
