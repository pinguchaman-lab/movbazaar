"use client";

import React from "react";
import { Plus, Check } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useLanguage } from "@/i18n";
import { WatchlistItem } from "@/lib/storage";

interface WatchlistButtonProps {
  item: Omit<WatchlistItem, "addedAt">;
}

export function WatchlistButton({ item }: WatchlistButtonProps) {
  const { isInList, add, remove } = useWatchlist();
  const { t } = useLanguage();
  const inWatchlist = isInList(item.tmdbId, item.type);

  const toggle = () => {
    if (inWatchlist) {
      remove(item.tmdbId, item.type);
    } else {
      add(item);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm backdrop-blur-md border transition-all ${inWatchlist
        ? "bg-emerald-600/80 border-emerald-500 text-white"
        : "bg-zinc-800/80 border-white/10 text-zinc-200 hover:text-white hover:bg-zinc-700/80"
        }`}
    >
      {inWatchlist ? (
        <>
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>{t.common.inWatchlist}</span>
        </>
      ) : (
        <>
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t.common.addToWatchlist}</span>
        </>
      )}
    </button>
  );
}

