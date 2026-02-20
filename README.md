# Final Stage | Professional Photography

A professional, high-end photography studio website built with Next.js, featuring a black and gold aesthetic with red accents.

## Tech Stack

- **Next.js 16** — React framework
- **TypeScript** — Type safety
- **Tailwind CSS v4** — Styling
- **Google Fonts** — Playfair Display (headings), Cormorant Garamond (body)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/` — App router pages and layout
- `src/components/` — Reusable sections: Header, Hero, About, Portfolio, Services, Contact, Footer
- `public/` — Static assets (add your own images here)

## Customization

- **Portfolio images**: Replace Unsplash URLs in `src/components/Portfolio.tsx` with your own photos, or add images to `public/` and use `/your-image.jpg`
- **Contact info**: Phone and email are in `src/components/Contact.tsx` and `src/components/Footer.tsx`
- **Colors**: Edit CSS variables in `src/app/globals.css` (`--gold`, `--accent-red`, etc.)

## Deploy

```bash
npm run build
npm start
```

Or deploy to [Vercel](https://vercel.com) with one click.
