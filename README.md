# 🌱 Rise of the Plants

> A mobile-first web game where you discover, grow, and evolve a collection of living botanical creatures — then project them into the real world with your camera.

Content is powered entirely by [Sanity](https://www.sanity.io/), gameplay is enforced by a stateless authoritative backend, and your progress lives right in your browser.

---

## ✨ Features

- **Discover species** — explore the wilderness to find new botanical creatures, each with its own rarity, lore, and stats.
- **Grow & evolve** — nurture your plants with water, nutrients, and sunlight to level them up and trigger evolutions.
- **Collection codex** — a living encyclopedia with habitat details, botanical notes, hidden facts, and evolution paths, all sourced from Sanity.
- **Turn-based battles** — face wild flora with attack / defend / special moves, complete with hit feedback, floating damage numbers, and victory rewards.
- **AR mode** — project your active plant into the real world through your camera and capture a watermarked screenshot to share.
- **Celebration overlays** — animated full-screen moments for level-ups, evolutions, and new discoveries.
- **First-run onboarding** — a quick stepper that explains the concept in seconds.

---

## 🏗️ Architecture

This project is a **pnpm monorepo** with a clear separation of concerns:

| Package | Role |
| --- | --- |
| `artifacts/rop` | The React + Vite mobile-first web game (frontend) |
| `artifacts/api-server` | Stateless Express backend — the gameplay authority |
| `lib/game-core` | Pure, framework-agnostic game logic (growth, evolution, battle) |
| `lib/sanity-content` | Typed client + content fetching for Sanity |

Key design decisions:

- **Sanity is the source of truth** for all content — species, lore, codex entries, evolution paths, tasks, and economy. Nothing is hardcoded.
- **The backend is stateless and authoritative.** The client round-trips the full player/battle state with each request, and the server validates every reward so progress can't be forged.
- **Player progress lives in browser `localStorage`** — no accounts required to start playing.
- **Content is read only through the backend's cached `/api/content/*` routes**, never directly from Sanity in the browser.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 24+
- [pnpm](https://pnpm.io/)
- A [Sanity](https://www.sanity.io/) project with the game content seeded

### Environment variables

The backend needs access to your Sanity project. Set these (e.g. via a `.env` or your host's secrets manager):

```
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=your_dataset
SANITY_API_VERSION=2024-01-01
SANITY_WRITE_TOKEN=your_token   # only needed for seeding content
```

> These are kept out of source control — anyone running the project supplies their own.

### Install & run

```bash
# install dependencies
pnpm install

# run the backend API server
pnpm --filter @workspace/api-server run dev

# run the game frontend
pnpm --filter @workspace/rop run dev
```

Then open the frontend URL shown in your terminal.

### Useful scripts

```bash
pnpm run typecheck                       # typecheck every package
pnpm --filter @workspace/rop run build   # production build of the game
```

---

## 📱 A note on AR

AR mode uses your device camera via `getUserMedia`, which requires:

- a **secure context** (HTTPS or localhost), and
- camera permission granted to the page.

For the best experience, open the game in its own browser tab on a phone rather than inside an embedded preview frame.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui
- **Backend:** Express 5, TypeScript (stateless)
- **Content:** Sanity (Portable Text for lore)
- **Tooling:** pnpm workspaces

---

## 📄 License

Created for the Replit × Sanity Buildathon.
