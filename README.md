# 💪 WeLiftTogether

A couples gym tracking app built with **React + Vite + Capacitor**, backed by **Supabase**.

## Stack

| Layer | Tech |
|---|---|
| UI | React 18 + Vite |
| Native | Capacitor 6 (Android) |
| Backend | Supabase (Postgres + Storage) |
| Haptics | `@capacitor/haptics` |
| Photos | `@capacitor/filesystem` + Supabase Storage |
| CI/CD | GitHub Actions |

## Features

- 🏠 **Home** — Daily routine picker, profile photo, workout photo gallery
- 💪 **Routines** — 3 pre-built routines (Piernas, Pecho, Brazos), fully editable
- 📊 **Stats** — Weekly/monthly activity chart, workout history with Supabase sync
- 📸 **Camera** — In-app camera with flip, flash, and countdown
- 📳 **Haptics** — Full haptic feedback on every interaction
- 🔄 **Swipe navigation** — Gesture-based tab switching
- 🤖 **Android back button** — Native hardware back handled correctly

## Quick Start

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Sync to Android
npm run cap:sync

# Open in Android Studio
npm run cap:android
```

## Environment Variables

Create a `.env.local` file (never commit this):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON=your-anon-key
```

Add the same secrets to **GitHub → Settings → Secrets and variables → Actions**:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON`

## Database Setup

Run `supabase/schema.sql` in your Supabase SQL Editor to create all required tables:
- `routines` — user's workout routines
- `workout_sessions` — completed session history
- `workout_photos` — gym photo gallery

Also create a **Storage bucket** named `gym-photos` (public).

## CI/CD Workflows

| Workflow | Trigger | What it does |
|---|---|---|
| `ci.yml` | Push to `main`/`develop`, PRs | Lint + Vite build, uploads `dist/` artifact |
| `deploy.yml` | Push to `main` | Deploys to GitHub Pages |
| `android.yml` | Version tags (`v*.*.*`) or manual | Builds debug/release APK |

### GitHub Pages Setup

1. Go to **Settings → Pages**
2. Set source to **GitHub Actions**
3. Push to `main` — the `deploy.yml` workflow handles the rest

### Android Release Signing

For signed release APKs, add these secrets:
- `KEYSTORE_FILE` — base64-encoded `.jks` keystore
- `KEYSTORE_PASSWORD`
- `KEY_ALIAS`
- `KEY_PASSWORD`

## Project Structure

```
├── src/
│   ├── App.jsx          # Full app — all components in one file
│   └── main.jsx         # React entry point
├── supabase/
│   └── schema.sql       # Database schema
├── .github/
│   └── workflows/
│       ├── ci.yml       # Build & lint
│       ├── deploy.yml   # GitHub Pages deploy
│       └── android.yml  # APK build
├── android/             # Capacitor Android project (after cap sync)
├── index.html
├── vite.config.js
├── capacitor.config.json
└── package.json
```
