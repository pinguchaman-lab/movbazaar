"use client";

import { useState, useEffect, useCallback } from "react";
import { UserPreferences, getPreferences, savePreferences } from "@/lib/storage";

export function usePreferences() {
  const [preferences, setPreferencesState] = useState<UserPreferences>({
    volume: 1,
    subtitlesEnabled: false,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setPreferencesState(getPreferences());
    setIsLoaded(true);
  }, []);

  const update = useCallback((prefs: Partial<UserPreferences>) => {
    savePreferences(prefs);
    setPreferencesState((prev) => ({ ...prev, ...prefs }));
  }, []);

  return {
    preferences,
    isLoaded,
    update,
  };
}

