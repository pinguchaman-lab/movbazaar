# MovBazaar — Personal Movie & TV Streaming Web Application

MovBazaar is a personal and local streaming web application built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **HLS.js**. It integrates with the **TMDB (The Movie Database) API** for metadata and posters, and interfaces with any **OMSS-compatible streaming backend** (such as CinePro Core) to discover and stream video sources.

---

## Architecture Overview

MovBazaar strictly separates metadata discovery from video source resolution:

```
┌────────────────────────────────────────────────────────────────────────┐
│                               MovBazaar                                │
├──────────────────────────────────┬─────────────────────────────────────┤
│      TMDB (Metadata Layer)       │      OMSS (Streaming Layer)         │
│  - Posters & Backdrops           │  - HLS & MP4 Playable Streams       │
│  - Titles, Synopses & Ratings    │  - Multiple Quality Levels          │
│  - Cast, Crew, Directors         │  - Multi-Track Audio Languages      │
│  - Seasons & Episode Guides      │  - Subtitles (WebVTT) Tracks        │
│  - Search & Discovery Genres     │  - Multiple Providers & Servers     │
└──────────────────────────────────┴─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         Custom Video Player                            │
│  - Built on HLS.js with HTML5 Video fallback                           │
│  - Dynamic quality level switcher (Auto, 1080p, 720p, etc.)           │
│  - Dynamic audio track selector (English, Hindi, etc.)                │
│  - WebVTT Subtitle selector (Off, English, Hindi, etc.)               │
│  - Playback progress tracking & resume (LocalStorage)                  │
│  - Next Episode auto-advance & overlay prompt                          │
│  - Fullscreen, Picture-in-Picture, Speed controls (0.5x - 2.0x)        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Architectural Separation of Concerns

1. **TMDB**:
   - Solely responsible for movies/TV metadata, posters, backdrops, season episode lists, cast credits, and search.
   - Protected behind server-side proxies and fallbacks to ensure zero API key leakage.
   - If no TMDB API key is supplied, MovBazaar automatically provides a rich curated catalog (Interstellar, Inception, Oppenheimer, Stranger Things, Breaking Bad, Arcane, etc.) so the application works out of the box without setup friction.

2. **OMSS Backend**:
   - Follows the [OMSS Specification](https://github.com/omss-spec/omss-spec).
   - Movie endpoint: `GET {OMSS_API_URL}/v1/movies/{tmdbId}?platform=web`
   - TV episode endpoint: `GET {OMSS_API_URL}/v1/tv/{tmdbId}/seasons/{season}/episodes/{episode}?platform=web`
   - Returns playable sources, video formats, audio track tags, and subtitle URLs.
   - **Offline Resilience**: If the OMSS backend is offline, the entire catalog, search, details, and watchlist remain 100% browsable. On watch pages, a clear diagnostic banner is shown along with a **Preview with Demo Stream** toggle for local player testing.

3. **UI Localization vs Video Audio**:
   - **UI Language** (English / हिन्दी): Controls the interface text, labels, and buttons.
   - **Audio Language**: Read directly from the `audioTracks` returned by OMSS for the specific stream. If Hindi audio is not returned for a title, Hindi is not shown in the audio track menu. Changing the website UI language never alters the video audio track.

---

## Features

- **Dark Streaming UI**: Designed with near-black backgrounds, subtle glassmorphism, responsive cards, and clean typography.
- **Hero & Carousels**: Featured hero with gradient contrast masks, horizontal trending carousels, and poster hover states.
- **Movie & TV Catalogs**: Browse by genre pills, sort by Popular / Top Rated / Newest, responsive 6-column (desktop), 4-column (tablet), and 2-column (mobile) grids.
- **Instant Search**: Global search bar in navbar with real-time debounced autocomplete dropdown for both movies and TV series.
- **Details Pages**: Backdrop banners, posters, overviews, cast cards, release dates, runtime, and real-time OMSS source availability badge.
- **TV Episode Guide**: Dynamic season dropdown with episode thumbnail cards, summaries, and direct playback links.
- **Watch History & Continue Watching**: Playback progress saved every 5 seconds to `localStorage`. Dedicated Continue Watching rail on homepage and full `/history` page.
- **Personal Watchlist**: Quick add/remove toggle across cards, hero, details pages, and `/watchlist` page without requiring authentication.
- **Custom Player Controls**:
  - HLS adaptive bitrate streaming with quality switcher
  - Multi-track audio language switcher
  - Subtitle track selector (WebVTT)
  - Multi-server / provider switcher
  - Seek bar with time display
  - Keyboard shortcuts (`Space`/`K` play/pause, `F` fullscreen, `M` mute, `←`/`→` skip 10s, `↑`/`↓` volume)
  - Next Episode countdown overlay

---

## Requirements

- **Node.js**: `18.17.0` or higher (tested with Node 20 / 24 LTS)
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **Modern Browser**: Chrome, Edge, Firefox, Safari, or Opera

---

## Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

File contents (`.env.local`):

```env
# TMDB API Key (Optional for preview, recommended for full catalog)
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here

# TMDB CDN Image Base URL
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# OMSS-compatible streaming backend endpoint (e.g. CinePro Core)
NEXT_PUBLIC_OMSS_API_URL=http://localhost:3000
```

> **Note**: `NEXT_PUBLIC_OMSS_API_URL` is centralized in `src/lib/config.ts`. It is never hard-coded in individual components.

---

## Obtaining a TMDB API Key

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/).
2. Navigate to **Account Settings** → **API**.
3. Request an API Key (Developer).
4. Paste the API Key into `.env.local` under `NEXT_PUBLIC_TMDB_API_KEY`.

---

## Running the Application

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port reported in your console) in your browser.

### 3. Production Build

To verify compilation and create an optimized production build:

```bash
npm run build
npm run start
```

---

## Project Structure

```text
MovBazaar/
├── .env.local.example          # Template for environment variables
├── .env.local                  # Local environment configuration
├── next.config.mjs             # Next.js image domain configuration
├── tailwind.config.ts          # Dark theme colors and design tokens
├── package.json
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with LanguageProvider and Navbar
│   │   ├── page.tsx            # Homepage with Hero, Continue Watching, Carousels
│   │   ├── movies/page.tsx     # Movie catalog with genre and sorting filters
│   │   ├── tv/page.tsx         # TV show catalog with genre and sorting filters
│   │   ├── search/page.tsx     # Multi-category search results page
│   │   ├── movie/[id]/page.tsx # Movie details with OMSS availability badge
│   │   ├── tv/[id]/page.tsx    # TV show details with season/episode browser
│   │   ├── watch/
│   │   │   ├── movie/[id]/page.tsx                   # Dedicated movie streaming player
│   │   │   └── tv/[id]/[season]/[episode]/page.tsx   # Dedicated TV episode player
│   │   ├── watchlist/page.tsx  # Personal watchlist page
│   │   ├── history/page.tsx    # Watch history and progress management
│   │   └── api/
│   │       ├── omss/movie/[id]/route.ts              # Server proxy for movie sources
│   │       ├── omss/tv/[id]/[season]/[episode]/route.ts # Server proxy for episode sources
│   │       ├── search/route.ts                       # Real-time search autocomplete proxy
│   │       └── tv/[id]/season/[seasonNumber]/route.ts# Season episode list proxy
│   │
│   ├── components/
│   │   ├── navbar/Navbar.tsx                         # Header with search dropdown & language toggle
│   │   ├── hero/Hero.tsx                             # Top spotlight hero banner
│   │   ├── movie-card/MovieCard.tsx                  # Media card with rating, hover play, watchlist toggle
│   │   ├── movie-grid/MovieGrid.tsx                  # 6-4-2 column responsive grid
│   │   ├── carousel/MediaCarousel.tsx                # Horizontal scrolling media rails
│   │   ├── continue-watching/ContinueWatching.tsx    # Resumable progress carousel
│   │   ├── episode-list/EpisodeList.tsx              # Season dropdown and episode cards
│   │   ├── omss-badge/OMSSAvailabilityBadge.tsx      # Real-time OMSS streaming status badge
│   │   ├── skeletons/index.tsx                       # Shimmer skeleton loading components
│   │   └── video-player/
│   │       ├── VideoPlayer.tsx                       # Complete HLS.js streaming video player
│   │       ├── QualitySelector.tsx                   # Video resolution selector
│   │       ├── AudioSelector.tsx                     # Multi-track audio language selector
│   │       ├── SubtitleSelector.tsx                  # WebVTT subtitle tracks selector
│   │       ├── ServerSelector.tsx                    # Multi-provider source selector
│   │       └── NextEpisodeOverlay.tsx                # TV series Up Next countdown overlay
│   │
│   ├── lib/
│   │   ├── config.ts           # Centralized configuration (OMSS URL, TMDB keys)
│   │   ├── tmdb.ts             # TMDB API client with server caching & fallbacks
│   │   ├── tmdb-fallback.ts    # Curated offline catalog for instant development
│   │   ├── omss.ts             # OMSS client conforming to the OMSS specification
│   │   ├── storage.ts          # LocalStorage abstractions for history and watchlist
│   │   └── utils.ts            # Tailwind class merger utility
│   │
│   ├── hooks/
│   │   ├── useWatchlist.ts     # Watchlist hook with tab sync events
│   │   ├── useWatchHistory.ts  # Watch history hook with resume timestamps
│   │   └── usePreferences.ts  # Player audio and quality preferences hook
│   │
│   ├── i18n/
│   │   ├── index.tsx           # Language context and useLanguage hook
│   │   ├── en.ts               # English translations dictionary
│   │   └── hi.ts               # Hindi (हिन्दी) translations dictionary
│   │
│   └── types/
│       ├── tmdb.ts             # TMDB movies, tv shows, credits, genres interfaces
│       └── omss.ts             # OMSS streams, subtitles, providers interfaces
```

---

## How OMSS Integration Works

When a user visits a watch page (`/watch/movie/[id]` or `/watch/tv/[id]/[season]/[episode]`):

1. **OMSS Request**:
   - The application invokes `getMovieSources(tmdbId)` or `getEpisodeSources(tmdbId, season, episode)`.
   - Sends:
     ```http
     GET {NEXT_PUBLIC_OMSS_API_URL}/v1/movies/{tmdbId}?platform=web
     ```
2. **Response Validation**:
   - Validates that sources are well-formed URLs with `streamable: true`.
   - Checks expiration timestamps (`expiresAt`).
   - Parses `audioTracks`, `quality`, and `subtitles`.
3. **Player Mounting**:
   - HLS stream is loaded into `hls.js`.
   - If multiple providers/servers are returned, the `ServerSelector` gives the user instant manual switching.
   - If multiple audio tracks exist in the source, `AudioSelector` displays them (e.g. `English`, `Hindi`, `Original`).
   - If subtitles are returned, `SubtitleSelector` attaches WebVTT subtitle tracks to the video.

---

## Troubleshooting

- **"Streaming backend unavailable" error**:
  Ensure your OMSS-compatible server is running at the address specified by `NEXT_PUBLIC_OMSS_API_URL` (default `http://localhost:3000`). You can also click **"Preview with Demo Stream"** on any watch page to test player controls using open sample streams.
- **Port Conflicts**:
  If your OMSS backend is running on `http://localhost:3000`, run Next.js on port 3001:
  ```bash
  npx next dev -p 3001
  ```
- **TMDB Posters not loading**:
  Verify internet connectivity to `image.tmdb.org`. If offline, MovBazaar automatically serves local SVG placeholders.

---

## Legal & Boundary Notice

MovBazaar is built strictly as a personal media frontend for home use. It does not implement DRM circumvention, credential bypass, piracy scrapers, or unauthorized access controls. All video sources must originate from a compliant, authorized OMSS backend instance.
