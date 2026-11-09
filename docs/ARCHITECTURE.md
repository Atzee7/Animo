# Arsitektur ANIMO

## Prinsip

1. **Zero storage** — server tidak menyimpan video, file `.m3u8`, atau database.
2. **Zero auth** — tidak ada login. Favorit dan riwayat hidup di `localStorage`.
3. **Server untuk metadata, browser untuk stream** — AniList di-fetch dan di-cache
   di server. Token episode AnimeParadise bersifat IP-bound, jadi resolusi stream
   dilakukan di browser.
4. **App Router** — server components untuk data, client components hanya untuk
   interaksi (search, player, localStorage, navigasi aktif).

## Peta folder

```text
Animo/
├─ design/                         # file desain FigCraft
├─ docs/
│  └─ ARCHITECTURE.md
├─ public/
│  └─ favicon.svg
├─ src/
│  ├─ app/
│  │  ├─ (site)/                   # layout publik: header + footer + bottom nav
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx               # /
│  │  │  ├─ browse/page.tsx        # /browse
│  │  │  ├─ search/page.tsx        # /search?q=
│  │  │  ├─ favorites/page.tsx     # /favorites
│  │  │  ├─ history/page.tsx       # /history
│  │  │  └─ anime/[id]/page.tsx    # /anime/:anilistId
│  │  ├─ (watch)/                  # layout imersif: header, tanpa footer
│  │  │  ├─ layout.tsx
│  │  │  └─ watch/[animeId]/[episode]/page.tsx
│  │  ├─ api/
│  │  │  └─ search/route.ts        # GET /api/search?q= (AniList)
│  │  ├─ error.tsx
│  │  ├─ globals.css               # token Tailwind v4 + base styles
│  │  ├─ layout.tsx                # font, metadata, html/body
│  │  ├─ loading.tsx
│  │  └─ not-found.tsx
│  ├─ components/
│  │  ├─ anime/                    # kartu, skor, tombol favorit
│  │  ├─ home/                     # hero, rail, shelf, episode terbaru
│  │  ├─ layout/                   # header, footer, search, bottom nav
│  │  ├─ ui/                       # primitif: button, badge, skeleton, dll.
│  │  └─ watch/                    # player, daftar episode, navigasi episode
│  ├─ hooks/
│  │  ├─ use-debounce.ts
│  │  ├─ use-favorites.ts
│  │  ├─ use-history.ts
│  │  ├─ use-hls-player.ts
│  │  └─ use-mounted.ts
│  ├─ lib/
│  │  ├─ anilist/                  # client, queries, mapper, tipe mentah
│  │  ├─ animeparadise/            # server, browser, mapper, tipe mentah
│  │  ├─ storage/                  # favorites, history, keys, wrapper aman
│  │  ├─ utils/                    # cn, format, episode
│  │  └─ site.ts                   # konfigurasi nama, nav, metadata
│  └─ types/
│     ├─ anime.ts                  # domain anime
│     ├─ api.ts                    # envelope response
│     └─ watch.ts                  # favorit, riwayat, episode, stream
├─ .env.example
├─ next.config.ts
├─ package.json
├─ postcss.config.mjs
├─ tsconfig.json
└─ README.md
```

## Peta route

| Route | Tipe | Sumber data | Catatan |
| --- | --- | --- | --- |
| `/` | Server | AniList (trending, top airing, recent) | Rail Lanjut Nonton adalah client component |
| `/browse` | Server | AniList `getBrowseAnime()` | Filter via query string |
| `/search?q=` | Server | AniList `searchAnime()` | Dropdown header memakai `/api/search` |
| `/anime/[id]` | Server | AniList `getAnimeDetail()` | `id` = AniList media ID |
| `/watch/[animeId]/[episode]` | Server + Client | AniList + AnimeParadise | Stream di-resolve di browser |
| `/favorites` | Client | `localStorage` | Tanpa API |
| `/history` | Client | `localStorage` | Tanpa API |
| `/api/search` | Route handler | AniList | Dipakai SearchBox |

## Alur data

### 1. Metadata (server)

```text
Page (server component)
  -> lib/anilist/client.ts
  -> https://graphql.anilist.co
  -> mapper -> types/anime.ts
  -> komponen presentasional
```

Fetch memakai `next: { revalidate }`:

- trending / top airing / popular: 30–60 menit
- recent episodes: 60 detik
- detail anime: 60 menit
- search: 5 menit

### 2. Pencarian instan (client)

```text
SearchBox (client)
  -> useDebounce(400ms)
  -> GET /api/search?q=
  -> lib/anilist/client.ts (server)
  -> dropdown hasil
```

### 3. Streaming (client)

```text
Watch page (server)
  -> AniList detail
  -> resolveAnimeParadiseMatch(title, year)
  -> getAnimeParadiseEpisodes(animeId)
  -> kirim uid + origin ke client

VideoPlayer (client)
  -> lib/animeparadise/browser.ts
  -> GET api.animeparadise.moe/ep/:uid?origin=:origin
  -> stream.animeparadise.moe/m3u8?url=...
  -> hls.js
```

**Kenapa resolusi stream tidak di server?** Token `/ep/:uid` terikat pada IP
pemanggil. Kalau di-resolve di server Vercel, token bisa tidak valid untuk
perangkat pengguna. Karena itu `/ep/:uid` dipanggil langsung dari browser.

Tidak ada route `/api/stream` dan tidak ada proxy video. Server tidak pernah
menyimpan atau meneruskan byte video.

## Kontrak API

### AniList

- Endpoint: `POST https://graphql.anilist.co`
- Tidak butuh API key.
- Query ada di `src/lib/anilist/queries.ts`:
  - `TRENDING_ANIME_QUERY`
  - `TOP_AIRING_QUERY`
  - `POPULAR_ANIME_QUERY`
  - `RECENT_EPISODES_QUERY`
  - `SEARCH_ANIME_QUERY`
  - `ANIME_DETAIL_QUERY`
  - `BROWSE_ANIME_QUERY`

### AnimeParadise

- `GET /search?q=` → `data[]` dengan `_id`, `title`, `animeSeason`, `posterImage`
- `GET /anime/:id/episode` → `data[]` dengan `uid`, `number`, `title`, `image`
- `GET /ep/:uid?origin=:id` → `data.episode.streamLink`, `data.episode.subData`,
  `data.episode.skipData`
- Playback: `https://stream.animeparadise.moe/m3u8?url=<encoded streamLink>`

Subtitle yang dipakai adalah entri `type: "vtt"`. Entri `ass` tidak bisa langsung
dipasang ke `<track>`.

### Override pencocokan AnimeParadise

AniList dan AnimeParadise memakai ID berbeda. Pencocokan otomatis memakai
judul (termasuk judul alternatif), tahun, dan jumlah episode, dengan variasi
judul tanpa suffix `Season N`, `Part N`, `Cour N`, atau `S N`.

Kalau sebuah anime tetap salah cocok atau tidak ditemukan, tambahkan mapping
manual di `src/lib/animeparadise/overrides.ts`:

```ts
export const animeParadiseOverrides: Record<number, string> = {
  97940: "qBc2O7jBL03Egce7", // AniList Black Clover -> AnimeParadise
};
```

Override diperiksa lebih dulu, jadi tidak ada request pencarian tambahan untuk
judul yang sudah dipetakan.

## Penyimpanan lokal

Key:

| Key | Isi |
| --- | --- |
| `animo:favorites:v1` | `FavoriteEntry[]` |
| `animo:history:v1` | `HistoryEntry[]` |

### FavoriteEntry

```ts
{
  animeId: number;
  title: string;
  coverImage: string;
  format: AnimeFormat | null;
  averageScore: number | null;
  seasonYear: number | null;
  addedAt: number;
}
```

### HistoryEntry

```ts
{
  animeId: number;
  title: string;
  coverImage: string;
  episodeNumber: number;
  episodeUid: string | null;
  animeParadiseId: string | null;
  progressSeconds: number;
  durationSeconds: number;
  updatedAt: number;
}
```

Aturan:

- Satu anime = satu entri riwayat. Episode terbaru menimpa episode sebelumnya.
- `useSyncExternalStore` dipakai agar UI dan antar-tab tetap sinkron.
- Semua akses `localStorage` dibungkus `try/catch`; private mode tidak membuat
  aplikasi crash.
- Snapshot server selalu array kosong agar tidak ada hydration mismatch.

## Konvensi komponen

- **Server component** secara default. Tambahkan `"use client"` hanya jika butuh
  state, effect, event handler, `usePathname`, atau `localStorage`.
- Komponen presentasional menerima tipe domain dari `src/types`, bukan bentuk
  mentah API.
- Semua pemetaan API → domain dilakukan di `lib/*/mapper.ts`.
- Jangan memanggil `fetch` AniList langsung dari client component; gunakan
  server component atau `/api/search`.
- Jangan memanggil `/ep/:uid` dari server component.

## Tailwind & token

Token warna dan font didefinisikan di `src/app/globals.css` memakai `@theme`:

- `background` `#0B0D0F`
- `surface` `#14171A`
- `border` `#252A2F`
- `foreground` `#F2F4F5`
- `muted` `#9BA3AA`
- `brand` `#2FBF71`
- `gold` `#E8B44A`
- `coral` `#E8664F`
- `font-display` → Archivo
- `font-body` → Manrope

Gunakan utility seperti `bg-surface`, `text-muted`, `border-border`, `text-brand`,
`font-display`. Hindari hardcode hex di komponen.

## Menambah halaman baru

1. Tambahkan route di `src/app/(site)/...` (atau `(watch)` untuk halaman imersif).
2. Ambil data di server component lewat `lib/anilist/client.ts` atau
   `lib/animeparadise/server.ts`.
3. Petakan ke tipe domain lewat mapper.
4. Pecah UI menjadi komponen di `components/<domain>/`.
5. Kalau butuh interaksi, buat client component kecil dan impor di server page.

## Langkah berikutnya

1. Isi halaman Home: hero, Lanjut Nonton, Episode Terbaru, Top Airing, Anime Populer.
2. Hubungkan Browse ke `getBrowseAnime()` + filter.
3. Lengkapi Watch: resolusi stream, progress, skip intro +85s, auto-next,
   prev/next, subtitle, quality.
4. Isi Favorites dan History dari hooks `useFavorites` / `useHistory`.
5. Rapikan responsif mengikuti frame `Home / Mobile` di FigCraft.
