import React from "react";
import { HeroSkeleton, MediaCarouselSkeleton } from "@/components/skeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-screen pb-16 space-y-8 sm:space-y-12">
      <HeroSkeleton />
      <div className="space-y-10 sm:space-y-12">
        <MediaCarouselSkeleton title="Trending Now" />
        <MediaCarouselSkeleton title="Popular Movies" />
        <MediaCarouselSkeleton title="Popular TV Shows" />
        <MediaCarouselSkeleton title="Top Rated Movies" />
      </div>
    </div>
  );
}
