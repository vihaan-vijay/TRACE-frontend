# 💻 TRACE Frontend - Trusted Records & Case Evidence
### Team Invictus | Smart India Hackathon 2026

---

## 📌 Mission
Build the **Next.js 14 (App Router)** client web platform featuring:
- Role-specific portals (Investigating Officer, Forensic Analyst, Judge).
- Dynamic forensic watermarking canvas overlay on PDF/Image previews (`[Name | Badge | IP | Time]`).
- Client-side SHA-256 pre-calculation before upload using `crypto.subtle`.
- Interactive investigation timeline and chain of custody verification modal.
- AI semantic search bar with instant excerpt highlighting.

## 🛠️ Stack
- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + Radix UI / Shadcn UI
- **Icons:** Lucide React
- **PDF Viewer:** `react-pdf` / `@react-pdf-viewer/core`
- **Charts & Graphs:** Recharts / Cytoscape.js

## 🚀 Quickstart
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:3000`.

## 📂 Key Architecture
- `src/app/` - Page routes (`/login`, `/dashboard`, `/cases/[id]`, `/evidence/[id]`, `/audit`)
- `src/components/` - Reusable UI widgets (`EvidenceViewer.tsx`, `WatermarkOverlay.tsx`, `CustodyTimeline.tsx`, `SearchBox.tsx`)
- `src/lib/` - API client and WebCrypto hashing utilities
