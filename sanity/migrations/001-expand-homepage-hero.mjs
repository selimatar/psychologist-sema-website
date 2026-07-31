// Phase 2 (expand) of the homePage.hero modularization: writes the new
// hero.title / hero.primaryButton / hero.secondaryButton fields alongside
// the existing hero.h1 / primaryButtonLabel+Path / secondaryButtonLabel+Path
// fields — nothing is removed here. Safe to run before or after deploying
// the schema/frontend change that reads the new field names, and safe to
// re-run (idempotent: recomputes from the current h1/button fields each time).
//
// Run the "contract" script (002-contract-homepage-hero.mjs) only after the
// new frontend build (reading hero.title / hero.primaryButton.*) is
// confirmed live — that step removes the old fields.
//
// Usage: node --env-file=.env 001-expand-homepage-hero.mjs
// Requires SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET, and
// SANITY_SEED_TOKEN (an Editor token from manage.sanity.io) in sanity/.env.
// Recommended: rehearse against a dataset copy first, e.g.
//   sanity dataset copy production staging
// and point SANITY_STUDIO_DATASET at "staging" for the rehearsal run.

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_SEED_TOKEN,
  useCdn: false,
});

const doc = await client.getDocument('homePage');

if (!doc) {
  throw new Error('homePage document not found — nothing to migrate.');
}

const { hero } = doc;

if (!hero) {
  throw new Error('homePage.hero is missing — nothing to migrate.');
}

await client
  .patch('homePage')
  .set({
    'hero.title': hero.h1,
    'hero.primaryButton': {
      _type: 'link',
      label: hero.primaryButtonLabel,
      path: hero.primaryButtonPath,
    },
    'hero.secondaryButton': {
      _type: 'link',
      label: hero.secondaryButtonLabel,
      path: hero.secondaryButtonPath,
    },
  })
  .commit();

console.log('Expanded homePage.hero: title/primaryButton/secondaryButton written (old fields untouched).');
