# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is three separate projects in one repo, each with its own `package.json`/`node_modules` and no shared build step between them:

- **`/`** — the public React frontend (this is what `npm run dev` at the repo root starts).
- **`server/`** — a Node/Express + Prisma + PostgreSQL (Supabase) backend for the booking system.
- **`sanity/`** — a standalone Sanity Studio for editing site content and availability.

## Commands

Frontend (repo root):
```bash
npm install
npm run dev       # Vite dev server with HMR
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npx eslint .      # lint (no separate `lint` script defined)
```

Backend (`server/`):
```bash
npm install
npm run dev              # node --watch src/server.js
npm run prisma:migrate   # apply schema changes (dev)
npm run seed             # create the one AdminUser row
npm test                 # jest --runInBand (unit + integration)
```

Sanity Studio (`sanity/`):
```bash
npm install
npm run dev       # sanity dev — local Studio for editing content/availability
npm run seed      # node --env-file=.env seed.mjs — one-time content seed (see below)
npm run deploy    # sanity deploy — publishes the hosted Studio URL
```

## Frontend Architecture

React 19 + React Router v6 SPA built with Vite, styled entirely with Tailwind CSS (no CSS-in-JS, no component library). Entry point is [src/main.jsx](src/main.jsx), which mounts `<App />` inside `<BrowserRouter>`.

**Routing & layout**: [src/App.jsx](src/App.jsx) defines the public routes (`/`, `/about`, `/services`, `/contact`) nested under a single `<Layout>`, which renders `Navbar` + `<Outlet />` + `Footer` once so the shell never remounts between pages. `Navbar` publishes its own live height into the `--navbar-h` CSS var (via `ResizeObserver`), which `Layout` uses for top padding — if you change the navbar's height/padding, that mechanism handles reflow automatically, no manual offset needed. A separate `/admin/*` branch (see "Admin panel" below) has its own chrome and does not use `Layout`.

**Content comes from Sanity exclusively — no hardcoded fallback copy**: every page/component that renders editable copy (`Home`, `About`, `Services`, `Contact`, `Navbar`, `Footer`) fetches its content live from Sanity via `useSanityQuery` ([src/lib/useSanityQuery.js](src/lib/useSanityQuery.js)) and renders directly from the fetched document — there is no `FALLBACK_*` constant duplicating Turkish copy anywhere in the codebase, and `src/data/content.js`/`content.tr.js` (the pre-Sanity hardcoded content files) have been deleted. `Home`, `About`, `Services`, and `Contact` each guard with `if (!content) return null;` so nothing renders (rather than stale/duplicated text) until the singleton document has loaded; list-shaped data (the `service` documents, `contactPage.faqs`, array fields within a singleton) defaults to `?? []` purely to avoid a crash, never to a hardcoded copy of the content. `Navbar`/`Footer` are the one exception to the "render nothing while loading" pattern — they stay mounted (with fields as `?? ""`/`?? []`) so the navbar's height-publishing `ResizeObserver` mechanism and page chrome don't disappear/reappear on every navigation. This means the site currently has **no offline/misconfigured-Sanity safety net**: if Sanity is unreachable, the affected page renders blank rather than falling back to old copy — an explicit tradeoff to avoid maintaining a second, driftable copy of every string in code. There is no i18n library or runtime language switcher.

**Sanity content client** (`src/lib/`): `sanityClient.js` creates a **`useCdn: true`** read-only client (no token) using `VITE_SANITY_PROJECT_ID`/`VITE_SANITY_DATASET`/`VITE_SANITY_API_VERSION` — deliberately different from the backend's availability client (see below), since marketing copy has no correctness requirement for instant reflection and should get CDN speed instead. `sanityImage.js` wraps `@sanity/image-url` (`createImageUrlBuilder`, the named export — the default export is deprecated). `SanityImage.jsx` renders a real Sanity image when a document has one, or falls back to `ImagePlaceholder` otherwise — all image fields are currently unset in the seed data (no real photos uploaded yet), so every image on the live site is still the placeholder box until the psychologist uploads one in Studio.

**Booking-topic taxonomy is intentionally split across two sources**: the fixed set of valid topic slugs (`anxiety`, `stress`, `self_confidence`, `relationships`, `overthinking`, `procrastination`, `transitions`, `emotional_regulation`, `unsure`) is hardcoded in `Contact.jsx` as `TOPIC_SLUGS`, mirroring `server/src/validators/bookingRequest.validator.js`'s Zod `TOPICS` enum exactly — this must stay in sync manually if that enum ever changes. Only each option's *display label* is Sanity-sourced, built from the `service` documents' `title` field (`topicValue` → `title` map); `unsure` has no `service` counterpart so it always uses a hardcoded label. Don't reintroduce a second hardcoded copy of the services list in `Contact.jsx` — that was a real drift bug this design fixed. `src/pages/admin/BookingRequests.jsx` keeps its own separate hardcoded `TOPIC_LABELS` map for the same reason `Navbar`/`Footer` avoid Sanity elsewhere — the admin panel doesn't fetch Sanity content at all (see "Admin panel" below), so its topic labels must be updated by hand in lockstep with the other two whenever the taxonomy changes.

**Styling tokens**: all custom colors, fonts, and border-radius values are defined once in [tailwind.config.js](tailwind.config.js) (`cream`, `sand`, `terracotta`, `sage.*`, `ink`, `charcoal`, `body`, `muted`, `font-serif` = Lora, `font-sans` = Work Sans). Use these Tailwind tokens instead of hardcoding new hex values or fonts. `ServiceCard.jsx`'s `tint` prop is a `'sage' | 'terracotta'` enum value (matching the Sanity schema), mapped internally to the actual Tailwind background classes via `tintClassMap` — never pass a raw class string.

**Booking form / slot picker**: `Contact.jsx` doubles as both the contact form and the booking-request form. `SlotPicker.jsx` fetches live availability from the backend (`GET /api/availability`) and renders a `react-day-picker` calendar + time grid: every day in range is shown and clickable (including fully closed days), with hours that aren't actually open on the selected date rendered disabled rather than hidden, so the calendar's shape never jumps around. On a `409` (slot taken between fetch and submit), `Contact.jsx` clears the selection and bumps `SlotPicker`'s `reloadToken` to force a refetch.

**Admin panel** (`src/pages/admin/`, `src/components/admin/`): a JWT-gated `/admin/*` section for the psychologist to review/approve/reject booking requests (`BookingRequests.jsx`) and manage manual reservations (`Reservations.jsx`). `RequireAdminAuth.jsx` checks a JWT in `localStorage` and redirects to `/admin/login` if absent/expired; `AdminLayout.jsx` provides the admin chrome (no public `Navbar`/`Footer`). `src/lib/adminApi.js` is the client for all `/api/admin/*` calls. This is entirely separate from Sanity Studio's own login — Studio access only gates content/availability editing, never booking data (bookings never touch Sanity, only Postgres).

## Backend Architecture (`server/`)

Node + Express + Prisma against PostgreSQL (Supabase), sized for ~20 bookings/week — no queues, no Redis, no materialized slot tables.

**Data model** ([server/prisma/schema.prisma](server/prisma/schema.prisma)): a single `Booking` table serves both client-submitted requests and the psychologist's manual reservations (`source: CLIENT_REQUEST | MANUAL`) — a pending request and a confirmed reservation are the same kind of thing (something holding a slot). Availability is **computed on the fly** per request, not materialized. Race-condition-safe slot-holding is enforced entirely by `Booking.lockKey` (`DateTime? @unique`): it mirrors `slotStart` while the row is `PENDING`/`APPROVED` and is cleared to `null` on `REJECTED`/`EXPIRED`/`CANCELLED`. Postgres treats every `NULL` as distinct, so a plain unique index gives atomic double-booking prevention with zero raw SQL, advisory locks, or `SELECT ... FOR UPDATE` — the only rule is that `lockKey` and `status` are always mutated together, inside one service module (`server/src/services/booking.service.js`).

**Availability comes from Sanity, bookings stay in Postgres**: `AvailabilityRule`/`BlockedPeriod` are *not* Prisma models — they're Sanity document types (`sanity/schemaTypes/availabilityRule.ts`, `blockedPeriod.ts`), edited by the psychologist in Studio instead of a custom CRUD admin screen. `server/src/services/availability.service.js` fetches them via `server/src/lib/sanityClient.js` (**`useCdn: false`** — availability must reflect edits instantly, since staleness could cause a double-booking; contrast with the frontend's `useCdn: true` content client above) and maps Sanity's editorial shape (`dayOfWeek: 'monday'`, `startTime: '09:00'`) into the `{dayOfWeek: 1, startMinutes: 540}` shape its pure, unit-tested `computeAvailableSlots(...)` function expects. `Booking` itself was deliberately kept out of Sanity — a document-store CMS doesn't give the ACID/unique-constraint guarantees "never double-book" depends on.

**Auth**: a single `AdminUser` row (bcrypt-hashed password, seeded via `npm run seed`, no public signup). `POST /api/auth/login` issues a 14-day JWT; `requireAdminAuth` middleware gates every `/api/admin/*` route.

**Email** (SendGrid, fire-and-forget relative to the API response): new request → psychologist notified; approved/rejected → client notified. There is no periodic expiry sweep or "your hold expired" email — a stale `PENDING` row (past its `pendingBookingTtlHours` TTL) is only expired opportunistically, inline, when something else touches its slot (a fresh `createBooking`/`rescheduleBooking` call for that exact `slotStart`, via `expireStaleAtSlot` in `booking.service.js`) or when `getAvailability` computes active bookings (`{status: 'PENDING', expiresAt: {gt: now}}` already excludes it). This is deliberate, not a gap: correctness never depended on a background sweep, and running one would need a persistent process, which doesn't fit the serverless (Vercel) deployment target — the only cost is that an unrejected, uncontested stale request can sit showing "Beklemede" in the admin panel until the psychologist rejects it or someone else requests that slot.

**Key files**: `server/src/services/booking.service.js` (owns every `lockKey`/status transition), `server/src/services/availability.service.js` (the slot algorithm + Sanity mapping), `server/src/lib/sanityClient.js`, `server/prisma/schema.prisma`. Tests live in `server/tests/` (`unit/` for pure functions, `integration/` with supertest against a real test Postgres — covers the concurrent-booking 409 path specifically).

## Sanity Studio (`sanity/`)

One Sanity project/dataset serves two purposes: **availability** (`availabilityRule`, `blockedPeriod` — read by the backend) and **site content** (everything else — read by the frontend). Public dataset, anonymous read access, no read token needed for either purpose; only the one-time seed script needs a write token.

**Content schemas** (`sanity/schemaTypes/`): `service` (one document per focus-area card, referenced by both Home and Services pages and by the Contact form's topic dropdown) plus five **singletons** — `siteSettings`, `homePage`, `aboutPage`, `servicesPage`, `contactPage`. Sanity Studio has no built-in singleton primitive, so each is created with a fixed, well-known `_id` (matching its type name) by the seed script, and `sanity.config.ts`'s `structureTool` is customized to present each as one always-open document (via `S.listItem().id(...).child(S.document().schemaType(...).documentId(...))`) instead of a list — don't add a `documentTypeListItems()` entry for these types elsewhere, or a second document could get created. `__experimental_actions: ['update', 'publish']` on each singleton hides create/duplicate/delete in Studio.

**All Studio field `title`/`description` labels are in Turkish** — the psychologist is the only Studio user and reads Turkish, so field names, dropdown option labels, and preview titles are all written for her, not for developers. This is a deliberate, explicit decision — don't revert individual schema fields to English labels for "consistency with code" reasons. Field `name`s (the actual JSON keys read by the frontend) stay English/camelCase as normal.

**Explicit content boundary**: validation/error strings, loading-state labels ("Gönderiliyor..."), and `aria-label`s stay hardcoded in the frontend, not in Sanity — these are transient application-state text tightly coupled to code logic, not copy an editor would think to open Studio for.

**`seed.mjs`**: a one-time, idempotent (`createOrReplace`, fixed `_id`s) migration script — never invoked by the running app — that populates the 5 singletons + 6 `service` documents with the exact Turkish copy that used to be hardcoded in the frontend (transcribed once at migration time from `src/data/content.tr.js` and each page's former hardcoded JSX; both are now deleted, since Sanity is the sole source of truth going forward and `seed.mjs` itself is what preserves that original copy). Requires `SANITY_SEED_TOKEN` (an Editor token from manage.sanity.io, `sanity/.env` only, never committed) in addition to the usual `SANITY_STUDIO_PROJECT_ID`/`SANITY_STUDIO_DATASET`. Safe to re-run.

**CORS**: the frontend's content client talks to Sanity directly from the browser, so the Studio's project settings (manage.sanity.io → API → CORS Origins) must list every origin the frontend is served from (each local dev port, plus the production domain) or reads will fail with a CORS error in the browser console — since there's no fallback copy, the affected page/section will render blank until the origin is added.

**Local Studio vs. hosted Studio — schema changes need a redeploy**: `npm run dev` (localhost:3333) reads schema files live off disk, so it always reflects whatever's currently in `sanity/schemaTypes/`. The hosted Studio the psychologist actually uses (`https://sema-psikolog.sanity.studio/`) is a static build snapshot — it does **not** auto-update when schema/config files change, only when someone runs `npm run deploy` again. If a new document type or field isn't showing up there, that's the first thing to check, not a code bug. `sanity.cli.ts` pins `studioHost: 'sema-psikolog'` (and `deployment.appId`) so `deploy` reuses the existing hostname/application instead of prompting.
