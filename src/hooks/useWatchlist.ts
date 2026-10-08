"use client";

import { useState, useEffect, useCallback } from "react";
import {
  WatchlistItem,
  getWatchlist,
  addToWatchlist as addStorage,
  removeFromWatchlist as removeStorage,
} from "@/lib/storage";

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    setItems(getWatchlist());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refresh();

    // Listen to storage changes across tabs or window events
    const handleStorageChange = () => refresh();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("watchlist_updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("watchlist_updated", handleStorageChange);
    };
  }, [refresh]);

  const add = useCallback(
    (item: Omit<WatchlistItem, "addedAt">) => {
      addStorage(item);
      refresh();
      window.dispatchEvent(new Event("watchlist_updated"));
    },
    [refresh]
  );

  const remove = useCallback(
    (tmdbId: number, type: "movie" | "tv") => {
      removeStorage(tmdbId, type);
      refresh();
      window.dispatchEvent(new Event("watchlist_updated"));
    },
    [refresh]
  );

  const isInList = useCallback(
    (tmdbId: number, type: "movie" | "tv") => {
      return items.some((i) => i.tmdbId === tmdbId && i.type === type);
    },
    [items]
  );

  return {
    items,
    isLoaded,
    add,
    remove,
    isInList,
    refresh,
  };
}

