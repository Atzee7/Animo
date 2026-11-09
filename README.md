# ANIMO

Situs streaming anime minimalis dengan pendekatan **zero-auth** dan **zero-storage**.
Metadata diambil dari AniList, daftar episode dan stream HLS dari AnimeParadise,
dan personalisasi (favorit + riwayat) disimpan di `localStorage` perangkat.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- hls.js (player kustom, bukan video.js)
- lucide-react
- AniList GraphQL untuk metadata
- AnimeParadise untuk episode + stream HLS

## Menjalankan

```bash
npm install
cp .env.example .env.local   # opsional, hanya untuk URL metadata
npm run dev
```

Buka `http://localhost:3000`.

Script lain:

```bash
npm run build      # production build
npm run start      # jalankan hasil build
npm run lint       # ESLint
npm run typecheck  # TypeScript tanpa emit
```

## Status

Fondasi arsitektur sudah dibuat: route, data layer, storage, hooks, komponen UI
dasar, dan player HLS. Halaman masih berupa placeholder yang siap diisi sesuai
desain `design/ANIMO.figcraft`.

Lihat [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) untuk peta folder, alur data,
kontrak API, dan skema `localStorage`.
