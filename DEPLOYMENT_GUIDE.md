# MovBazaar — Complete Vercel Deployment & Hosting Guide

## Architecture Overview

**MovBazaar** is architected as a **100% serverless full-stack Next.js web application**.

### Do you need a VPS (Virtual Private Server) or separate backend?
**NO.** You do **NOT** need a VPS (Render, Railway, DigitalOcean, or EC2) to host MovBazaar.
- **Frontend**: Rendered using Next.js App Router and hosted globally on Vercel's Edge CDN.
- **Backend & APIs**: Built-in Next.js Serverless Route Handlers (`/api/auth/*`, `/api/search/*`, etc.) run as Vercel Serverless Functions.
- **Database**: No database is required! Watch history and watchlists persist in local browser storage, and VIP login sessions are validated serverless via signed cookies and environment variables.
- **Streaming Servers**: Verified streaming mirrors (`VidLink Pro`, `VidSrc PM`, `VidSrc SU`, `AutoEmbed CO`, `2Embed CC`) deliver video streams directly to the user's browser with zero bandwidth cost on your Vercel plan.

---

## Step-by-Step Vercel Deployment Guide

### Step 1: Push Code to GitHub
1. Make sure all changes are committed locally:
   ```bash
   git add .
   git commit -m "feat: complete MovBazaar with verified mirrors, VIP ad-free system, and regional discovery"
   ```
2. Create a new repository on your GitHub account (e.g. `movbazaar`).
3. Push your repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/movbazaar.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** -> **"Project"**.
3. Select your `movbazaar` repository from the list and click **"Import"**.

### Step 3: Configure Environment Variables in Vercel
In the **Environment Variables** section on Vercel, add the following key-value pairs:

| Variable Name | Value | Purpose |
|---------------|-------|---------|
| `NEXT_PUBLIC_TMDB_API_KEY` | `c48ed38773d7b8a1d1b558a666154e28` | Fetches movie & TV metadata and posters |
| `NEXT_PUBLIC_TMDB_IMAGE_BASE_URL` | `https://image.tmdb.org/t/p` | TMDB image CDN base URL |
| `NEXT_PUBLIC_OMSS_API_URL` | `http://localhost:3000` | Fallback OMSS endpoint |
| `VIP_USERS` | `vip@movbazaar.com:movbazaar2026,admin@movbazaar.com:admin2026` | Email:Password credentials for Ad-Free VIP access |
| `TMDB_API_KEY` | `your_tmdb_api_key_here` | Server-private TMDB key (never exposed to browser clients) |
| `NEXT_PUBLIC_TMDB_IMAGE_BASE_URL` | `https://image.tmdb.org/t/p` | TMDB poster & backdrop image CDN |
| `VIP_SECRET` | `generate_random_32_char_secret` | Cryptographic secret for signing tamper-proof VIP tokens |
| `VIP_USERS` | `user@movbazaar.com:SecretPass2026` | Comma-separated `Email:Password` list for Ad-Free VIP accounts |
| `NEXT_PUBLIC_SITE_URL` | `https://movbazaar.vercel.app` | Canonical domain for sitemap and SEO indexation |

> **Tip:** You can issue any credentials you wish by adding `custom@email.com:password123` to the `VIP_USERS` list separated by commas!
> **Security Note:** `TMDB_API_KEY` and `VIP_SECRET` are strictly kept server-side on Vercel functions and are **never** included in client JavaScript bundles or network requests, ensuring zero traceability. You can issue VIP accounts to anyone simply by adding `newuser@domain.com:Password123` to `VIP_USERS`.

### Step 4: Click Deploy!
- Click **"Deploy"**.
- Vercel will build the project in ~60 seconds and assign you a free production domain like `movbazaar.vercel.app`.
- You can also link a custom domain (e.g. `movbazaar.com`) for free in Vercel settings!

---

## Features Built-in

1. **Independent VIP Ad-Free System**:
   - Anyone can visit and watch movies without logging in (free guest mode with sponsor cards).
   - Any user you provide credentials to can click **"VIP Pass"** in the top navigation, sign in, and immediately experience **100% Ad-Free streaming** across the whole site.
2. **Deep Filter & Discovery**:
   - **Indian Cinema** (Bollywood, Telugu, Tamil, Malayalam)
   - **Korean Cinema & K-Dramas** (Squid Game, Parasite, Crash Landing on You, etc.)
   - **Hollywood & International**
   - **Language Selection**: Hindi, English, Korean, Telugu, Tamil, Japanese, Spanish, etc.
   - **Year-wise Selection**: 2026, 2025, 2024, 2023, 2020s, 2010s, Classics.
   - **Format Switcher**: Instant 1-click toggle between Movies and TV Series.
3. **High-Quality Search Autocomplete**:
   - Ranks results by title match and popularity, filtering out 0-vote student films or broken entries.
4. **Verified Unblocked Streaming Mirrors**:
   - Server 1: VidLink Pro (Ultra HD 1080p, Dual Audio, Hindi Dubbed option)
   - Server 2: VidSrc PM (Cloudflare Ultra CDN)
   - Server 3: VidSrc SU (Fast Mirror)
   - Server 4: AutoEmbed CO (Auto HD Direct)
   - Server 5: 2Embed CC (Backup Direct Stream)

