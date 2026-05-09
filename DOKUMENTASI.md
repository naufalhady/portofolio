# Dokumentasi Portfolio — Fullstack (Next.js + Laravel)

## Daftar Isi

1. [Gambaran Umum](#1-gambaran-umum)
2. [Struktur Proyek](#2-struktur-proyek)
3. [Teknologi](#3-teknologi)
4. [Pengembangan Lokal](#4-pengembangan-lokal)
5. [API Endpoints](#5-api-endpoints)
6. [Database](#6-database)
7. [Deployment: Backend (Railway)](#7-deployment-backend-railway)
8. [Deployment: Frontend (Vercel)](#8-deployment-frontend-vercel)
9. [Troubleshooting](#9-troubleshooting)
10. [Cara Kerja Sistem](#10-cara-kerja-sistem)

---

## 1. Gambaran Umum

Aplikasi portfolio personal dengan arsitektur **Frontend-Backend terpisah**:

```
Browser → Vercel (Next.js) → Railway (Laravel API) → SQLite (Database)
```

- **Frontend** — Next.js 16 (App Router) menampilkan data portfolio di halaman publik.
- **Backend** — Laravel 13 API menyediakan data portfolio melalui REST API.
- **CMS** — Halaman `/admin` untuk login dan mengelola data portfolio.
- **Auth** — Laravel Sanctum (token-based) untuk melindungi endpoint admin.

---

## 2. Struktur Proyek

```
portofolio/
├── backend/                      # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       └── Api/
│   │   │           ├── Admin/        # Controller admin (auth, profile, skill, project)
│   │   │           └── PortfolioController.php  # Controller publik
│   │   └── Models/               # Profile, Skill, Project, User
│   ├── config/
│   │   ├── cors.php              # CORS: allowed_origins = *
│   │   ├── database.php          # Koneksi DB + auto-create SQLite
│   │   ├── sanctum.php
│   │   └── view.php              # Compiled view path
│   ├── database/
│   │   ├── database.sqlite       # File database (git-ignored)
│   │   ├── migrations/           # Schema migrations
│   │   └── seeders/              # Data sample (admin user, profile, skills, projects)
│   ├── routes/
│   │   └── api.php               # Semua route API
│   ├── bootstrap/app.php         # Laravel app config (named-arg routing)
│   ├── railpack.toml             # PHP version untuk Railway build
│   └── Procfile                  # Start command fallback
│
├── frontend/                     # Next.js 16
│   ├── src/
│   │   └── app/
│   │       ├── page.js           # Landing page (midnight theme)
│   │       ├── admin/
│   │       │   ├── page.js       # CMS dashboard
│   │       │   └── login/page.js # Halaman login admin
│   │       ├── globals.css       # Tailwind v4 (import, @theme inline, utilities)
│   │       └── layout.js
│   ├── .env.local                # NEXT_PUBLIC_API_URL (local: localhost:8000)
│   ├── vercel.json               # { "framework": "nextjs" }
│   └── next.config.mjs
│
├── AGENTS.md                     # Panduan konteks untuk AI coding agent
├── DOKUMENTASI.md                # Dokumen ini
└── .gitignore
```

---

## 3. Teknologi

### Backend

| Teknologi | Versi | Keterangan |
|---|---|---|
| PHP | ^8.4 | Runtime |
| Laravel | 13 | Framework |
| SQLite | — | Database (file-based, tanpa setup) |
| Sanctum | — | Auth API token |
| Railpack | 0.23.0 | Builder Railway (auto-detect Laravel) |

### Frontend

| Teknologi | Versi | Keterangan |
|---|---|---|
| Next.js | 16 | React framework (App Router, Turbopack) |
| Tailwind CSS | 4 | Styling (v4: @import, @theme inline) |
| React | 19 | Library |

### Platform Deploy

| Platform | Untuk | Harga |
|---|---|---|
| Railway | Backend (Laravel) | Gratis (trial, $5 credit) |
| Vercel | Frontend (Next.js) | Gratis |

---

## 4. Pengembangan Lokal

### Prasyarat

- PHP ^8.4 + Composer
- Node.js 22+
- SQLite (biasanya built-in dengan PHP)

### Setup Backend

```bash
cd backend
cp .env.example .env
php artisan key:generate
composer install
php artisan migrate --seed
php artisan serve --port=8000
```

### Setup Frontend

```bash
cd frontend
cp .env.example .env.local  # jika ada
# atau buat manual:
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

npm install
npm run dev
```

### Two-terminal Dev Workflow

```
Terminal 1: cd backend && php artisan serve --port=8000
Terminal 2: cd frontend && npm run dev
```

Buka `http://localhost:3000` untuk landing page.

### Login Admin

- URL: `http://localhost:3000/admin/login`
- Email: `admin@portfolio.com`
- Password: `password`

### Commands Penting

```bash
# Backend
php artisan migrate:fresh --seed   # Reset DB + seed ulang
php artisan db:seed --force        # Seed ulang tanpa migrate
php artisan optimize:clear         # Clear cache (wajib setelah ganti route/controller)
php artisan tinker                 # REPL

# Frontend
npm run dev    # Dev server (Turbopack)
npm run build  # Production build
npm run lint   # ESLint
```

---

## 5. API Endpoints

Semua endpoint di-prefix dengan `/api`.

### Publik (tanpa auth)

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/portfolio` | Data portfolio (nama, tagline, skills, projects) |
| GET | `/api/portfolio/about` | Data about (bio, location) |

### Admin (auth: Sanctum token)

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | `/api/admin/login` | Login, return token |
| POST | `/api/admin/logout` | Logout, hapus token |
| GET | `/api/admin/me` | Info user yang login |
| GET | `/api/admin/profile` | Get profile (dengan skills & projects) |
| PUT | `/api/admin/profile` | Update profile |
| GET | `/api/admin/skills` | List skills |
| POST | `/api/admin/skills` | Tambah skill |
| DELETE | `/api/admin/skills/{skill}` | Hapus skill |
| GET | `/api/admin/projects` | List projects |
| POST | `/api/admin/projects` | Tambah project |
| PUT | `/api/admin/projects/{project}` | Update project |
| DELETE | `/api/admin/projects/{project}` | Hapus project |

### Auth Flow

1. `POST /api/admin/login` dengan email+password → return **token**.
2. Simpan token di `localStorage` dengan key `admin_token`.
3. Kirim header `Authorization: Bearer <token>` untuk request admin.
4. Jika 401 → hapus token, redirect ke `/admin/login`.

---

## 6. Database

### Tipe

**SQLite** — file tunggal di `backend/database/database.sqlite`. Tidak perlu setup server database.

### Tabel

| Tabel | Foreign Key | Fungsi |
|---|---|---|
| `profiles` | — | Data profil (1 baris) |
| `skills` | `profile_id` | Skills, ordered by `sort_order` |
| `projects` | `profile_id` | Projects, kolom `tags` JSON cast ke array |

### Seeder

`DatabaseSeeder` membuat data sample:

- **User**: admin@portfolio.com / password
- **Profile**: 1 profil dengan data dummy
- **Skills**: Laravel, Next.js, Tailwind CSS, React, PHP
- **Projects**: 2 project dummy

### Auto-create Database

Di `config/database.php`, ada logika untuk auto-create file SQLite jika belum ada:

```php
$dbPath = env('DB_DATABASE', database_path('database.sqlite'));
if (env('DB_CONNECTION', 'sqlite') === 'sqlite'
    && !str_starts_with($dbPath, '/dev/')
    && !file_exists($dbPath)) {
    $dir = dirname($dbPath);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    touch($dbPath);
}
```

Ini penting karena Railway melakukan fresh clone (tanpa file database).

---

## 7. Deployment: Backend (Railway)

### Arsitektur Railway

```
Railway
└── Project: protective-light
    └── Service: portofolio
        └── rootDirectory: /backend
            └── Railway mount backend/ → /app/
                ├── artisan
                ├── config/
                ├── database/
                ├── public/
                └── ...
```

### File Konfigurasi Deploy

**`backend/railpack.toml`** — memaksa PHP 8.4:

```toml
[php]
version = "8.4"
```

**`backend/Procfile`** — fallback start command:

```
web: php artisan serve --host=0.0.0.0 --port=$PORT
```

Railpack auto-detect Laravel, jadi Procfile hanya sebagai fallback.

### Langkah Deploy Backend

#### 1. Setup Railway Account

Buat akun di [railway.app](https://railway.app).

#### 2. Buat Project Baru

Dashboard → **Projects** → **New Project** → **Deploy from GitHub** → pilih repo `naufalhady/portofolio`.

Railway auto-detect:
- Provider: **PHP**
- Root Directory: **`/backend`**
- Build: **Railpack** (v0.23.0)

#### 3. Environment Variables

Di Railway dashboard → service **portofolio** → **Variables** tab:

| Variable | Value |
|---|---|
| `APP_KEY` | (generate: `php artisan key:generate --show`) |
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_URL` | `https://<railway-url>` |
| `DB_CONNECTION` | `sqlite` |

#### 4. Start Command

Start command already set via Railway API / dashboard:

```
php artisan migrate --force --seed && php artisan serve --host=0.0.0.0 --port=$PORT
```

Ini otomatis menjalankan migrasi + seeder tiap deploy.

#### 5. Deploy

Push ke GitHub → Railway auto-deploy. Atau dari dashboard klik **Deploy**.

### Railway CLI

```bash
npm i -g @railway/cli               # Install
railway login                       # Login (interaktif)
railway login --browserless         # atau non-interaktif (butuh token)

export RAILWAY_API_TOKEN=<token>    # Set token
railway link -p <project-id> -s <service-id> -e <environment-id>
railway variable set KEY=VALUE      # Set env vars
railway logs                        # Lihat logs
railway logs --deployment           # Deployment logs
railway restart --yes               # Restart service
railway ssh php artisan migrate --force  # Run command via SSH
```

### Permasalahan & Fix Railway

| Masalah | Sebab | Fix |
|---|---|---|
| Build gagal: `View path not found` | `config/view.php` hilang | Buat dari Laravel stock config, hapus `realpath()` |
| 500: Database file not found | SQLite file tidak ada di fresh build | Auto-create di `config/database.php` |
| 500: no such table | Migrasi belum dijalankan | `startCommand: php artisan migrate --force --seed` |

---

## 8. Deployment: Frontend (Vercel)

### Langkah Deploy Frontend

#### 1. Setup Vercel

Buka [vercel.com](https://vercel.com) → **Import Repository** → pilih `naufalhady/portofolio`.

#### 2. Konfigurasi

| Setting | Value |
|---|---|
| **Root Directory** | `frontend` |
| **Framework** | Next.js (auto-detect via `vercel.json`) |

#### 3. Environment Variable

Di Vercel dashboard → **Settings** → **Environment Variables**:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://<railway-url>/api` |

#### 4. Deploy

Klik **Deploy** → Vercel auto-build. Setiap push ke GitHub, Vercel auto-redeploy.

### Vercel CLI

```bash
npm i -g vercel
vercel login
vercel env add NEXT_PUBLIC_API_URL   # Set env var
vercel redeploy                       # Redeploy
```

---

## 9. Troubleshooting

### `Connection Error` / `Unexpected token '<'`

**Sebab**: Frontend fetch dari API tapi dapet HTML (biasanya 500 atau 404).

**Cek**:
1. `NEXT_PUBLIC_API_URL` di Vercel dashboard sudah benar?
2. Railway backend sedang berjalan? Cek `https://<railway-url>/api/portfolio`.
3. Lihat Railway logs: `railway logs --deployment`.

### `SQLSTATE[HY000]: General error: 1 no such table`

**Sebab**: Database file ada tapi tabel belum dibuat (migrasi belum jalan).

**Fix**: Pastikan start command mencakup `php artisan migrate --force --seed`. Redeploy.

### Backend 500 setelah deploy

1. Cek Railway logs: `railway logs --deployment | grep "ERROR"`.
2. `APP_DEBUG=false` menyembunyikan error detail — set `true` sementara.
3. Pastikan `APP_KEY` sudah di-set.
4. Pastikan `storage/` writable.

### `railway ssh` gagal: `Host key verification failed`

**Sebab**: SSH host Railway belum di-approve.

**Fix**:
```bash
# Tambahkan SSH key ke Railway
railway ssh keys add -k ~/.ssh/id_ed25519.pub -n nama-key

# Atau set start command via GraphQL API sebagai alternatif
```

### File database tidak persist antar deploy

**Sebab**: Railway melakukan fresh clone tiap deploy. SQLite file tidak di-commit (di `.gitignore`).

**Fix**: Start command menjalankan `migrate --force --seed` tiap deploy. Auto-create file di `config/database.php` memastikan file ada.

---

## 10. Cara Kerja Sistem

### Request Flow

```
1. User buka https://portofolio-fehr.vercel.app/
2. Next.js render halaman → 'use client' component mount
3. Component fetch:
   - GET https://<railway>/api/portfolio
   - GET https://<railway>/api/portfolio/about
4. Laravel query SQLite → return JSON
5. Component render data (nama, skill, project, etc.)
```

### Deploy Flow

```
Developer push ke GitHub
├── Railway trigger build
│   ├── Railpack detect PHP/Laravel
│   ├── composer install (PHP 8.4)
│   ├── php artisan view:cache
│   └── Deploy container → jalanin startCommand:
│       php artisan migrate --force --seed
│       && php artisan serve --host=0.0.0.0 --port=$PORT
│
└── Vercel trigger build
    ├── Deteksi Next.js
    ├── npm install
    ├── npm run build
    └── Deploy ke edge network
```

### Aliran Data (CMS)

```
Admin login (/admin/login)
  → POST /api/admin/login → return token
  → Simpan token di localStorage
  → GET /api/admin/profile → tampilkan dashboard
  → CRUD skills/projects via endpoint admin
  → Data langsung tersimpan ke SQLite
  → Landing page otomatis update
```

### Konsep Kunci

1. **Separation of Concerns**: Frontend (Next.js) dan Backend (Laravel) terpisah total, komunikasi via HTTP API.
2. **SQLite tanpa setup**: Cocok untuk proyek kecil/solo. File database auto-created.
3. **Railpack**: Railway otomatis mendeteksi Laravel, PHP 8.4, start command.
4. **Tailwind v4**: Menggunakan `@import "tailwindcss"` bukan `@tailwind directives`. Warna kustom di `@theme inline {}`.
5. **Next.js 16 App Router**: Client components pakai `'use client'`, router dari `next/navigation`.
