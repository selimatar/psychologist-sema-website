# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev       # Vite dev server with HMR
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npx eslint .      # lint (no separate `lint` script defined)
```

There is no test suite configured in this project.

## Architecture

React 18 + React Router v6 SPA built with Vite, styled entirely with Tailwind CSS (no CSS-in-JS, no component library). Entry point is [src/main.jsx](src/main.jsx), which mounts `<App />` inside `<BrowserRouter>`.

**Routing & layout**: [src/App.jsx](src/App.jsx) defines all routes nested under a single `<Layout>` (`/`, `/about`, `/services`, `/contact`). `Layout` renders `Navbar` + `<Outlet />` + `Footer` once, so the shell never remounts between pages. `Navbar` publishes its own live height into the `--navbar-h` CSS var (via `ResizeObserver`), which `Layout` uses for top padding — if you change the navbar's height/padding, that mechanism handles reflow automatically, no manual offset needed.

**Content is data-driven**: page copy (services list, FAQ entries, etc.) lives in `src/data/*.js` as plain objects/arrays rather than inline JSX, so text edits don't require touching components. There are two parallel content files, `content.js` (English, original/reference) and `content.tr.js` (Turkish) — pages currently import from `content.tr.js` directly. There is no i18n library or runtime language switcher; switching the site's language means changing each page's import back to `content.js` (or building a real i18n layer if both are needed live).

**Styling tokens**: all custom colors, fonts, and border-radius values are defined once in [tailwind.config.js](tailwind.config.js) (`cream`, `sand`, `terracotta`, `sage.*`, `ink`, `charcoal`, `body`, `muted`, `font-serif` = Lora, `font-sans` = Work Sans). Use these Tailwind tokens instead of hardcoding new hex values or fonts.

**Components** (`src/components/`) are small and presentational: `ServiceCard`, `FaqItem`, `CtaBanner`, `ImagePlaceholder` (a placeholder box standing in for images not yet supplied). Pages (`src/pages/`) compose these components with data pulled from `src/data/content.tr.js`.
