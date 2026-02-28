# Final Stage | Professional Photography

A professional, high-end photography studio website built with Next.js, featuring a black and gold aesthetic with red accents. Includes an admin panel for managing portfolio images, categories, contact info, and SEO.

## Tech Stack

- **Next.js 16** — React framework
- **TypeScript** — Type safety
- **Tailwind CSS v4** — Styling
- **Supabase** — Database, storage, auth
- **Google Fonts** — Playfair Display (headings), Cormorant Garamond (body)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Panel Setup

To enable the admin panel (`/admin`), you need to configure Supabase and environment variables.

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a project
2. In **Project Settings → API**, copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Service role key (secret) → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Run the Database Schema

In Supabase **SQL Editor**, run the contents of `supabase/schema.sql`.

If you already have an existing database, run `supabase/migration-videos.sql`, `supabase/migration-hero.sql`, `supabase/migration-proposal-video-autoplay.sql`, `supabase/migration-intro-video-autoplay.sql`, and `supabase/migration-autoplay-customized.sql` to add video, hero image, video autoplay, and autoplay default columns.

### 3. Create the Storage Bucket

In Supabase **Storage**:

1. Create a new bucket named `portfolio`
2. Set it to **Public** (so portfolio images can be displayed)

### 4. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=your-secure-password
```

For Netlify, add these in **Site settings → Environment variables**.

### 5. Migrate Existing Portfolio Images

To upload your current `public/portfolio_pictures` images to Supabase:

```bash
npm run migrate:portfolio
```

Ensure `.env.local` exists with your Supabase credentials.

### 6. Access the Admin Panel

Visit `/admin`, enter your `ADMIN_PASSWORD`, and manage:

- **Site Settings** — Phone, email, SEO (title, description, keywords), intro video URL, proposal video URL
- **Categories** — Add, edit, or delete portfolio categories
- **Portfolio** — Upload, edit, or delete images

## Project Structure

- `src/app/` — App router pages, layout, API routes
- `src/app/admin/` — Admin panel (login, dashboard, settings, categories, portfolio)
- `src/components/` — Header, Hero, About, Portfolio, Services, Contact, Footer
- `src/lib/` — Supabase client, auth helpers
- `supabase/schema.sql` — Database schema
- `scripts/migrate-portfolio.ts` — Image migration script

## Deploy

```bash
npm run build
npm start
```

Or deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com). Add the environment variables in your hosting provider’s dashboard.

## Fallback Without Supabase

If Supabase is not configured, the site will show:

- Default contact info and SEO metadata
- An empty portfolio
- API routes will return 500 for admin operations

Configure Supabase and run the migration to enable full functionality.
