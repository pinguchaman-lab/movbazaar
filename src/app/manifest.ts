import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MovBazaar — Official Movie & TV Streaming",
    short_name: "MovBazaar",
    description:
      "Watch full movies and TV series online for free in Ultra HD with Dual Audio, subtitles, and fast servers.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#e50914",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

