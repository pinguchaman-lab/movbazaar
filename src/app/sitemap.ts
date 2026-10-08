import { MetadataRoute } from "next";
import { FALLBACK_MOVIES, FALLBACK_TV_SHOWS } from "@/lib/tmdb-fallback";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://movbazaar.vercel.app";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/movies`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/tv`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/search`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/movies?category=indian`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/tv?category=korean`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
  ];

  const movieRoutes: MetadataRoute.Sitemap = FALLBACK_MOVIES.map((movie) => ({
    url: `${siteUrl}/movie/${movie.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const tvRoutes: MetadataRoute.Sitemap = FALLBACK_TV_SHOWS.map((show) => ({
    url: `${siteUrl}/tv/${show.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...movieRoutes, ...tvRoutes];
}

