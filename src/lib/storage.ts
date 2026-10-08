/**
 * LocalStorage management for Watch History, Watchlist, and Player Preferences
 */

export interface WatchHistoryItem {
  tmdbId: number;
  type: "movie" | "tv";
  title: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  progress: number; // in seconds
  duration: number; // in seconds
  timestamp: number; // timestamp in ms
}

export interface WatchlistItem {
  tmdbId: number;
  type: "movie" | "tv";
  title: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  voteAverage?: number;
  releaseYear?: string;
  addedAt: number;
}

export interface UserPreferences {
  preferredAudioLanguage?: string;
  preferredQuality?: string;
  subtitlesEnabled?: boolean;
  preferredSubtitleLanguage?: string;
  volume?: number;
}

const STORAGE_KEYS = {
  HISTORY: "movbazaar_watch_history",
  WATCHLIST: "movbazaar_watchlist",
  PREFERENCES: "movbazaar_user_preferences",
};

// Safe localStorage access helper
function getStoredJson<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Failed to read ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setStoredJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage:`, e);
  }
}

// Watch History APIs
export function getWatchHistory(): WatchHistoryItem[] {
  const items = getStoredJson<WatchHistoryItem[]>(STORAGE_KEYS.HISTORY, []);
  // Sort descending by most recently updated
  return items.sort((a, b) => b.timestamp - a.timestamp);
}

export function saveWatchProgress(item: Omit<WatchHistoryItem, "timestamp">): void {
  const items = getWatchHistory();
  const index = items.findIndex((i) => {
    if (item.type === "movie") {
      return i.tmdbId === item.tmdbId && i.type === "movie";
    }
    return (
      i.tmdbId === item.tmdbId &&
      i.type === "tv" &&
      i.season === item.season &&
      i.episode === item.episode
    );
  });

  const updatedItem: WatchHistoryItem = {
    ...item,
    timestamp: Date.now(),
  };

  if (index >= 0) {
    items[index] = updatedItem;
  } else {
    items.unshift(updatedItem);
  }

  // Keep up to 100 recent items
  setStoredJson(STORAGE_KEYS.HISTORY, items.slice(0, 100));
}

export function getWatchItem(
  tmdbId: number,
  type: "movie" | "tv",
  season?: number,
  episode?: number
): WatchHistoryItem | undefined {
  const items = getWatchHistory();
  return items.find((i) => {
    if (type === "movie") {
      return i.tmdbId === tmdbId && i.type === "movie";
    }
    return (
      i.tmdbId === tmdbId &&
      i.type === "tv" &&
      i.season === season &&
      i.episode === episode
    );
  });
}

export function removeWatchItem(
  tmdbId: number,
  type: "movie" | "tv",
  season?: number,
  episode?: number
): void {
  const items = getWatchHistory().filter((i) => {
    if (type === "movie") {
      return !(i.tmdbId === tmdbId && i.type === "movie");
    }
    return !(
      i.tmdbId === tmdbId &&
      i.type === "tv" &&
      i.season === season &&
      i.episode === episode
    );
  });
  setStoredJson(STORAGE_KEYS.HISTORY, items);
}

export function clearWatchHistory(): void {
  setStoredJson(STORAGE_KEYS.HISTORY, []);
}

// Watchlist APIs
export function getWatchlist(): WatchlistItem[] {
  const items = getStoredJson<WatchlistItem[]>(STORAGE_KEYS.WATCHLIST, []);
  return items.sort((a, b) => b.addedAt - a.addedAt);
}

export function isInWatchlist(tmdbId: number, type: "movie" | "tv"): boolean {
  const items = getWatchlist();
  return items.some((i) => i.tmdbId === tmdbId && i.type === type);
}

export function addToWatchlist(item: Omit<WatchlistItem, "addedAt">): void {
  const items = getWatchlist();
  if (items.some((i) => i.tmdbId === item.tmdbId && i.type === item.type)) {
    return;
  }
  items.unshift({
    ...item,
    addedAt: Date.now(),
  });
  setStoredJson(STORAGE_KEYS.WATCHLIST, items);
}

export function removeFromWatchlist(tmdbId: number, type: "movie" | "tv"): void {
  const items = getWatchlist().filter(
    (i) => !(i.tmdbId === tmdbId && i.type === type)
  );
  setStoredJson(STORAGE_KEYS.WATCHLIST, items);
}

// User Preferences APIs
export function getPreferences(): UserPreferences {
  return getStoredJson<UserPreferences>(STORAGE_KEYS.PREFERENCES, {
    volume: 1,
    subtitlesEnabled: false,
  });
}

export function savePreferences(prefs: Partial<UserPreferences>): void {
  const current = getPreferences();
  setStoredJson(STORAGE_KEYS.PREFERENCES, { ...current, ...prefs });
}

