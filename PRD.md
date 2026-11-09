# Product Requirement Document (PRD)

## Situs Web Streaming Anime Minimalis — ANIMO (Zero-Auth & Zero-Storage)

### 1. Ringkasan Eksekutif & Tujuan Proyek

Proyek ini bertujuan untuk membangun situs web *streaming* anime modern bernamanya **ANIMO** yang sangat ringan, cepat, dan responsif. ANIMO dibangun dengan pendekatan **Full Next.js** tanpa membutuhkan sistem penyimpanan file video mandiri (*0 MB Storage*) maupun sistem otentikasi/login database (*No-Auth Architecture*).

Situs ini mengandalkan API publik (*Consumet API*) untuk mengambil metadata dan URL aliran video (`.m3u8`), serta memanfaatkan `localStorage` pada peramban (*browser*) untuk fitur personalisasi pengguna (riwayat dan favorit).

### 2. Prinsip Desain & Arsitektur Utama

1. **Zero Storage (Tanpa Media Lokal):** Tidak ada berkas `.mp4` atau `.m3u8` yang disimpan di server aplikasi. Aliran video diputar langsung dari sumber eksternal (*HLS Streaming*).

2. **Zero Auth / No-Database:** Tidak memerlukan registrasi, login, atau manajemen *database* (MySQL/PostgreSQL). Data pengguna disimpan 100% secara lokal di peramban pengguna.

3. **Full Next.js Ecosystem:** Menggunakan Next.js secara menyeluruh untuk mengelola antarmuka (UI), routing dinamis, optimasi media (Next Image), serta API handler jika diperlukan.

4. **Pemuatan Cepat & Minimalis:** Berfokus pada kecepatan pemuatan halaman dan navigasi yang intuitif tanpa pernak-pernik yang memperberat performa.

5. **Mobile-First & Clean UI:** Tampilan yang ramah perangkat seluler dengan antarmuka bertema gelap (*Dark Mode*) khas ANIMO.

### 3. Arsitektur Teknis & Full Next.js Tech Stack

| Komponen | Teknologi / Layanan | Fungsi Detail | 
| ----- | ----- | ----- | 
| **Core Framework** | **Full Next.js (React)** | Kerangka kerja *full-stack* utama (Routing, SSR/SSG/ISR, dan Optimasi Performance) | 
| **Language** | JavaScript (ES6+) / TypeScript | Bahasa pemrograman utama aplikasi | 
| **Video Player** | `video.js` + `hls.js` | Pemutar video HLS kustom tanpa iklan bawaan pihak ketiga | 
| **API Provider** | Consumet API (Gogoanime Provider) | Sumber metadata, pencarian, dan link stream `.m3u8` | 
| **Persistensi Data** | HTML5 `localStorage` | Menyimpan riwayat menonton & daftar favorit *client-side* | 
| **Styling** | CSS Modules / Tailwind CSS / Inline CSS | Penggayaan antarmuka *responsive* & *Dark Theme* | 
| **Hosting & Deployment** | Vercel Platform | Infrastruktur *hosting* Next.js native gratis dengan CI/CD otomatis | 

### 4. Spesifikasi Fitur Detail

#### 4.1. Fitur Pintar Pengunjung (Client-Side Persistence via `localStorage`)

* **Riwayat "Lanjut Nonton" (Continue Watching):**

  * Secara otomatis menyimpan ID anime, judul, ID episode, nomor episode, serta penanda waktu (*timestamp*) detik terakhir ditonton.

  * Menampilkan widget *quick-resume* di halaman utama jika riwayat tersedia.

* **Daftar Favorit Saya (Bookmark):**

  * Mengizinkan pengguna menambah/menghapus anime ke dalam daftar favorit dengan sekali klik ikon hati/bintang.

  * Halaman khusus `/favorites` untuk melihat kumpulan anime favorit yang disimpan di peramban.

#### 4.2. Sistem Pemutar Video (Video Player Enhancements)

* **Custom HLS Player:** Menggunakan `video.js` yang terintegrasi dengan `hls.js` untuk menguraikan manifes `.m3u8`.

* **Tombol Navigasi Episode:**

  * Tombol `⏮️ Prev Episode` (disabled jika episode 1).

  * Tombol `Next Episode ⏭️` (disabled jika episode terakhir).

* **Auto-Next Episode:** Pemutar otomatis memuat dan memutar episode berikutnya saat video selesai (`ended` event).

* **Tombol "Skip Intro" (+85s):** Tombol pintas untuk melompati lagu pembuka (*opening theme*) sebesar 85 detik.

* **Cadangan Server (Fallback Source):** Menangani kegagalan stream dengan memilih URL cadangan dari *response payload* API.

#### 4.3. Penemuan & Navigasi Konten (Discovery & Navigation)

* **Instant Search Bar (Header):**

  * Input pencarian cepat di bagian navigasi atas dengan branding logo ANIMO.

  * Fitur *debounce* (400ms) untuk mengurangi *rate-limit* request API.

  * *Dropdown* hasil pencarian melayang (*floating result*) dengan thumbnail dan judul.

* **Seksi " Episode Terbaru Rilis" (Recent Episodes):**

  * Menampilkan daftar 20 episode anime yang baru rilis dari API secara otomatis.

* **Seksi " Seluruh / Katalog Anime Populer" (Top Airing):**

  * Menampilkan *grid* katalog anime populer untuk penjelajahan umum.

* **Daftar Episode Kompak:**

  * *Grid* tombol nomor episode (`1`, `2`, `3`, dst.) pada halaman menonton yang mudah ditekan pada layar sentuh ponsel.

### 5. Integrasi Endpoints API (Consumet API)

1. **Episode Terbaru:**
   `GET https://api.consumet.org/anime/gogoanime/recent-episodes`

2. **Katalog Populer / Top Airing:**
   `GET https://api.consumet.org/anime/gogoanime/top-airing`

3. **Pencarian Anime:**
   `GET https://api.consumet.org/anime/gogoanime/{query}`

4. **Detail Anime & Daftar Episode:**
   `GET https://api.consumet.org/anime/gogoanime/info/{anime-id}`

5. **Link Stream Video:**
   `GET https://api.consumet.org/anime/gogoanime/watch/{episode-id}`
