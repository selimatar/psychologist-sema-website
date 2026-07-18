# Psychologist Sema — Website

Marketing site for an online psychotherapy practice, built with React, React Router, and Tailwind CSS, bundled by Vite.

## Stack

- **React 18** + **React Router v6** (client-side routing, single layout shell)
- **Tailwind CSS** for styling (custom palette/fonts in [tailwind.config.js](tailwind.config.js))
- **Vite** for dev server and build

## Getting Started

```bash
npm install
npm run dev       # start local dev server with HMR
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

## Project Structure

```
src/
  main.jsx              # app entry, mounts <App /> with BrowserRouter
  App.jsx                # route table
  components/
    Layout.jsx            # shared shell (Navbar + Footer) via <Outlet />
    Navbar.jsx
    Footer.jsx
    CtaBanner.jsx
    ServiceCard.jsx
    FaqItem.jsx
    ImagePlaceholder.jsx  # placeholder box for images not yet supplied
  pages/
    Home.jsx
    About.jsx
    Services.jsx
    Contact.jsx
  data/
    content.js             # site copy, English (original/reference)
    content.tr.js          # site copy, Turkish (currently used by pages)
```

Routes (defined in [src/App.jsx](src/App.jsx)):

| Path        | Page              |
|-------------|-------------------|
| `/`         | Home              |
| `/about`    | About             |
| `/services` | Services          |
| `/contact`  | Contact           |

`Layout` wraps every route so the navbar/footer don't remount on navigation.

## Content

Copy lives in `src/data/` as plain JS objects/arrays (services list, FAQ entries, etc.) rather than inline in JSX, so text edits don't require touching components. Pages currently import from `content.tr.js` (Turkish); `content.js` holds the original English copy for reference — there is no runtime language switcher.

## Styling

Custom design tokens (colors, fonts, border radius) are defined once in [tailwind.config.js](tailwind.config.js) and used via Tailwind utility classes throughout — see that file before hardcoding a new color or font.
