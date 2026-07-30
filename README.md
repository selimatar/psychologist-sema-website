# Psychologist Sema — Website

Marketing site and booking system for an online psychotherapy practice. The repo has three parts: a React/Vite frontend, a Node/Express booking backend, and a Sanity Studio used to edit both site content and appointment availability without touching code.

## Stack

- **Frontend** — React 18 + React Router v6, styled entirely with Tailwind CSS, bundled by Vite. All page content is fetched live from Sanity — no hardcoded copy in the frontend.
- **Backend** (`server/`) — Node + Express + Prisma against PostgreSQL (Supabase), handles booking requests/reservations with race-condition-safe slot locking, JWT-gated admin API, SendGrid email notifications.
- **CMS** (`sanity/`) — a standalone Sanity Studio. Editable there: all page copy, the services list, nav/footer, and the psychologist's weekly availability + blocked-off time.

Each of the three has its own `package.json`/`node_modules` and is installed/run independently.

## Getting Started

### Frontend (repo root)

```bash
npm install
npm run dev       # start local dev server with HMR
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

Copy `.env.example` to `.env.local` and fill in `VITE_API_BASE_URL` (the backend's URL) and the `VITE_SANITY_*` values (same project/dataset as `sanity/.env`).

### Backend (`server/`)

```bash
cd server
npm install
npm run prisma:migrate   # apply the Prisma schema to your Postgres database
npm run seed              # create the one AdminUser row (psychologist's login)
npm run dev                # node --watch src/server.js
npm test                   # unit + integration tests (jest --runInBand)
```

Copy `server/.env.example` to `server/.env` and fill in your Supabase `DATABASE_URL`/`DIRECT_URL`, a `JWT_SECRET`, SendGrid credentials, the Sanity project/dataset (for reading availability), and the Google Form settings. See the comments in that file for where each value comes from.

### Sanity Studio (`sanity/`)

```bash
cd sanity
npm install
npm run dev       # local Studio at localhost:3333, for editing content/availability
npm run deploy    # publishes to the hosted Studio URL (https://sema-psikolog.sanity.studio/)
npm run seed      # one-time: populates content documents with the site's current copy
```

Copy `sanity/.env.example` to `sanity/.env` and fill in `SANITY_STUDIO_PROJECT_ID`/`SANITY_STUDIO_DATASET`. `SANITY_SEED_TOKEN` (an Editor token from manage.sanity.io) is only needed to run `npm run seed`. The hosted Studio hostname is pinned to `sema-psikolog` in `sanity.cli.ts`, so `npm run deploy` won't prompt for it.

**Important**: the hosted Studio (`https://sema-psikolog.sanity.studio/`) is a static build — it only reflects schema/config changes after you run `npm run deploy` again. Only the local `npm run dev` Studio picks up schema edits automatically.

**Note**: the Studio's project settings (manage.sanity.io → API → CORS Origins) must list every origin the frontend is served from, or content requests from the browser will fail with a CORS error and the affected page/section will render blank — the frontend has no hardcoded fallback copy to fall back to.

## Project Structure

```
src/                        # frontend
  main.jsx                   # app entry, mounts <App /> with BrowserRouter
  App.jsx                     # route table (public routes + /admin/*)
  components/
    Layout.jsx                 # shared public shell (Navbar + Footer) via <Outlet />
    Navbar.jsx, Footer.jsx      # both fetch siteSettings from Sanity
    CtaBanner.jsx, ServiceCard.jsx, FaqItem.jsx, ImagePlaceholder.jsx
    SanityImage.jsx             # renders a Sanity image, or falls back to ImagePlaceholder
    SlotPicker.jsx               # calendar + time-grid booking-slot picker
    admin/                       # AdminLayout, RequireAdminAuth (JWT gate)
  pages/
    Home.jsx, About.jsx, Services.jsx, Contact.jsx   # each fetches and renders its own Sanity doc
    admin/                        # AdminLogin, BookingRequests, Reservations
  lib/
    sanityClient.js, sanityImage.js, useSanityQuery.js   # frontend Sanity content client (useCdn: true)
    adminApi.js                    # client for the backend's /api/admin/* routes

server/                      # booking backend
  prisma/schema.prisma         # AdminUser + Booking models
  src/
    routes/                       # availability, booking-requests, auth, admin/*
    services/
      availability.service.js       # slot algorithm + Sanity availability mapping
      booking.service.js             # owns every lockKey/status transition
      email.service.js, googleForm.service.js
    middleware/requireAdminAuth.js
  tests/                        # unit (pure functions) + integration (supertest + real Postgres)

sanity/                      # Sanity Studio
  schemaTypes/
    siteSettings.ts, homePage.ts, aboutPage.ts, servicesPage.ts, contactPage.ts   # singletons
    service.ts                     # one document per focus-area card
    availabilityRule.ts, blockedPeriod.ts
  sanity.config.ts              # singleton structure customization
  seed.mjs                        # one-time content seed (idempotent)
```

Public routes (defined in [src/App.jsx](src/App.jsx)):

| Path        | Page              |
|-------------|-------------------|
| `/`         | Home              |
| `/about`    | About             |
| `/services` | Services          |
| `/contact`  | Contact + booking request form |

Admin routes (JWT-gated, no public Navbar/Footer): `/admin/login`, `/admin` (booking requests), `/admin/reservations`.

## Content

All site copy — page text, the services list, nav/footer, FAQs — is edited by the psychologist in Sanity Studio, not in code. Each page fetches its Sanity document on mount and renders directly from it; there is no hardcoded `FALLBACK_*` copy anywhere in the frontend, and no static content file backing any of this (the old `src/data/content.js`/`content.tr.js` were deleted once Sanity became the live source). This is a deliberate tradeoff: if Sanity is unreachable or a document doesn't exist yet, the affected page/section simply renders blank instead of showing stale duplicated text — the alternative would mean maintaining a second, driftable copy of every string in code. There is no runtime language switcher.

The one exception: the booking form's topic dropdown values (`anxiety`, `stress`, etc.) are a fixed enum shared with the backend's validator — only each option's *label* comes from Sanity.

Image fields exist on every content type but are unset until the psychologist uploads real photos in Studio — every image on the site is currently the placeholder box (`ImagePlaceholder`/`SanityImage` handle this automatically).

## Booking System

Clients pick a real available slot on `/contact` (`SlotPicker`, backed by `GET /api/availability`) and submit a request. The psychologist reviews/approves/rejects requests and creates manual reservations from `/admin`. Availability (weekly hours + blocked time off) is managed in Sanity Studio; actual bookings live in Postgres, where a unique constraint on `Booking.lockKey` makes double-booking impossible even under concurrent requests. See `CLAUDE.md` for the full architecture writeup.

## Styling

Custom design tokens (colors, fonts, border radius) are defined once in [tailwind.config.js](tailwind.config.js) and used via Tailwind utility classes throughout — see that file before hardcoding a new color or font.
