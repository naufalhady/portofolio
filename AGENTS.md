# Portfolio — Fullstack (Next.js + Laravel)

## Project structure
```
portofolio/
├── backend/          # Laravel 13 API (PHP 8.4, SQLite, Sanctum)
│   ├── routes/api.php         # all API routes
│   ├── bootstrap/app.php      # Laravel app config (named-arg routing)
│   └── config/cors.php        # CORS: allowed_origins = *
└── frontend/         # Next.js 16 + Tailwind v4 (App Router, Turbopack)
    ├── src/app/page.js        # landing page (midnight theme)
    ├── src/app/admin/page.js  # CMS dashboard
    ├── src/app/admin/login/page.js
    ├── src/app/globals.css    # Tailwind v4 @import + @theme inline colors
    └── .env.local             # NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Commands

### Backend (Laravel)
```bash
cd backend
composer install
php artisan serve --port=8000          # start API server
php artisan migrate:fresh --seed       # reset DB + seed sample data
php artisan db:seed --force            # re-seed without migrate
php artisan optimize:clear             # clear all caches (do this after route/class changes)
php artisan tinker                     # REPL (use --execute for one-liners)
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev              # Turbopack dev server on :3000
npm run build            # production build
npm run lint             # eslint
```

### Two-terminal dev workflow
```bash
# Terminal 1
cd backend && php artisan serve --port=8000
# Terminal 2
cd frontend && npm run dev
```

## Key conventions

### Auth
- **Admin login**: `admin@portfolio.com` / `password` (from seeder)
- API uses **Sanctum tokens** stored in `localStorage` as `admin_token`
- Public endpoints: `GET /api/portfolio`, `GET /api/portfolio/about`
- Protected endpoints (Sanctum): `/api/admin/*`
- Frontend auth check reads `localStorage` + redirects to `/admin/login` via `window.location.href`
- On 401, token is removed and redirect to login page

### Database
- **SQLite** at `backend/database/database.sqlite` — no external DB setup
- Tables: `profiles` (1 row), `skills` (belongs to profile), `projects` (belongs to profile, JSON tags)
- `profile_id` foreign key on skills and projects

### Tailwind v4 (NOT v3)
- Uses `@import "tailwindcss"` — **not** `@tailwind` directives
- Custom theme colors defined in `@theme inline {}` block (not `tailwind.config.js`)
- Utility classes: `.input-cms` and `.btn-primary` defined in `globals.css` via `@apply`

### Next.js 16 quirks
- Docs at `node_modules/next/dist/docs/` — check this before using unfamiliar APIs
- `useRouter` from `next/navigation` (App Router), NOT `next/router`
- Client components use `'use client'` directive
- Uses Turbopack in dev (fast, but some edge cases differ from webpack)

### Laravel 13 quirks
- `bootstrap/app.php` uses **named arguments** for `withRouting()`, `withMiddleware()`
- Routes in `routes/api.php` are auto-prefixed with `/api`
- API route registration: `->withRouting(api: __DIR__.'/../routes/api.php', ...)`
- Controllers under `Api\Admin` namespace for protected endpoints
- CORS config: `allowed_origins => ['*']` — permissive for dev
- Do NOT put admin routes in a separate `routes/admin.php` — put them in `routes/api.php` to avoid conflicts with `bootstrap/app.php` routing

### Models
- `Profile` hasMany `Skill` and `Project` (ordered by `sort_order`)
- `Skill` and `Project` belongTo `Profile`
- `Project.tags` is JSON cast to array
- Always `->load(['skills', 'projects'])` when returning profile from admin API

### Data flow
1. Landing page (`/`) fetches `/api/portfolio` + `/api/portfolio/about` on mount
2. CMS dashboard (`/admin`) fetches `/api/admin/profile` (with skills+projects loaded)
3. CRUD on skills/projects via dedicated admin endpoints
4. Frontend stores token in localStorage; backend validates via Sanctum middleware

## Deployment

### Frontend — Vercel (free, auto-deploy from GitHub)
1. Push to GitHub
2. Import repo at https://vercel.com/import
3. Set root directory: `frontend`
4. Add env: `NEXT_PUBLIC_API_URL=https://<backend-url>/api`
5. Vercel auto-detects Next.js — no extra config needed

### Backend — Railway (free tier, $5 credit/mo)
1. Create account at https://railway.app
2. New project → Deploy from GitHub → select repo
3. Root directory: `backend`
4. Railway auto-detects PHP via Nixpacks
5. Add env vars in dashboard:
   - `APP_KEY` — run `php artisan key:generate --show` locally
   - `APP_ENV=production`
   - `APP_DEBUG=false`
   - `APP_URL=https://<railway-url>`
   - `DB_CONNECTION=sqlite`
6. Start command (set via Railway dashboard or `Procfile`):
   `php artisan serve --host=0.0.0.0 --port=$PORT`
7. Run `php artisan migrate --force` via Railway shell after first deploy

### After deploy
- Update `NEXT_PUBLIC_API_URL` in Vercel to point to the Railway backend URL
- Re-deploy frontend (or Vercel auto-deploys on push)

## Recurring pitfalls
- Deleting `app/Http/Controllers/Admin/` controllers (without `Api\` prefix) — they conflict with the correct `Api\Admin` controllers
- Adding `then:` callback in `bootstrap/app.php` for admin routes — use `routes/api.php` instead
- Forgetting `php artisan optimize:clear` after moving/renaming controllers or changing routes
- Using `new Date()` or `Math.random()` in client components can cause hydration mismatch — use `suppressHydrationWarning` on `<body>` if browser extensions interfere
