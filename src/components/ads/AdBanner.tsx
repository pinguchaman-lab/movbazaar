"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, Zap, ArrowRight, Lock } from "lucide-react";

interface AdBannerProps {
  slot?: "player-bottom" | "catalog-header" | "home-middle" | "default";
  className?: string;
}

export function AdBanner({ slot = "default", className = "" }: AdBannerProps) {
  const { isVip, openLoginModal } = useAuth();

  // If user is a verified VIP with admin-issued credentials: ZERO ads rendered!
  if (isVip) {
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
                Streaming in Free Guest Mode
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Support MovBazaar by viewing sponsor cards, or enter your VIP pass for uninterrupted 100% ad-free playback.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={openLoginModal}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#e50914] to-[#b80710] hover:from-[#f40d1a] hover:to-[#c90812] text-white text-xs font-bold shadow-lg shadow-red-950/60 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Remove Ads (VIP Pass)</span>
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
          Sponsored
        </span>
        <div className="truncate">
          <span className="font-semibold text-zinc-200">
            Streaming Free on MovBazaar
          </span>{" "}
          <span className="text-zinc-400 hidden sm:inline">
            • Log in with your VIP credentials to eliminate all ads site-wide.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={openLoginModal}
          className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors px-2 py-1 rounded-lg hover:bg-zinc-800/60"
        >
          <Lock className="w-3 h-3 text-amber-400" />
          <span>VIP Ad-Free</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

