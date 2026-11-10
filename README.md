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

## Akses dari HP (ngrok)

Pratinjau di HP lewat tunnel HTTPS tanpa deploy:

```bash
# terminal 1
npm run dev

# terminal 2
npm run tunnel                          # URL acak (berubah tiap restart)
npm run tunnel -- xxxx.ngrok-free.app   # domain statis
```

Domain statis juga bisa disimpan sekali di `.env.local` sebagai `NGROK_DOMAIN`,
lalu `npm run tunnel` memakainya otomatis. Ambil domain gratis di
<https://dashboard.ngrok.com/domains>.

Buka URL `https://...ngrok-free.app` di HP, lalu tekan **Visit Site** sekali
saat muncul halaman peringatan ngrok.

Catatan:

- Video HLS diambil langsung oleh HP dari CDN AnimeParadise, jadi tidak melewati
  ngrok — batas bandwidth gratis hanya terpakai untuk HTML/JS dan `/api/search`.
- Token stream terikat IP pemanggil, dan resolusi terjadi di browser, jadi tetap
  jalan dari jaringan HP.
- Next dev memblokir aset `/_next/*` dari origin lain; `allowedDevOrigins` di
  `next.config.ts` sudah mengizinkan domain ngrok.
- Alternatif di Wi-Fi yang sama tanpa ngrok: `npm run dev:phone` lalu buka
  `http://<IP-lokal-PC>:3000`.


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
