"use client";

import { useState, useEffect, useCallback } from "react";
import {
  WatchHistoryItem,
  getWatchHistory,
  saveWatchProgress as saveStorage,
  getWatchItem as getItemStorage,
  removeWatchItem as removeStorage,
  clearWatchHistory as clearStorage,
} from "@/lib/storage";

export function useWatchHistory() {
  const [items, setItems] = useState<WatchHistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    setItems(getWatchHistory());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refresh();

    const handleStorageChange = () => refresh();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("history_updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("history_updated", handleStorageChange);
    };
  }, [refresh]);

  const saveProgress = useCallback(
    (item: Omit<WatchHistoryItem, "timestamp">) => {
      saveStorage(item);
      refresh();
      window.dispatchEvent(new Event("history_updated"));
    },
    [refresh]
  );

  const getItem = useCallback(
    (tmdbId: number, type: "movie" | "tv", season?: number, episode?: number) => {
      return getItemStorage(tmdbId, type, season, episode);
    },
    []
  );

  const removeItem = useCallback(
    (tmdbId: number, type: "movie" | "tv", season?: number, episode?: number) => {
      removeStorage(tmdbId, type, season, episode);
      refresh();
      window.dispatchEvent(new Event("history_updated"));
    },
    [refresh]
  );

  const clear = useCallback(() => {
    clearStorage();
    refresh();
    window.dispatchEvent(new Event("history_updated"));
  }, [refresh]);

  return {
    items,
    isLoaded,
    saveProgress,
    getItem,
    removeItem,
    clear,
    refresh,
  };
}

