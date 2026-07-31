// Phase 2 (contract) of the homePage.hero modularization: removes the old
// hero.h1 / primaryButtonLabel+Path / secondaryButtonLabel+Path fields.
//
// Only run this AFTER:
//   1. 001-expand-homepage-hero.mjs has run against this dataset, and
//   2. the frontend build reading hero.title / hero.primaryButton.* /
//      hero.secondaryButton.* is confirmed live (so nothing still depends
//      on the old fields).
//
// Usage: node --env-file=.env 002-contract-homepage-hero.mjs
// Requires the same env vars as 001-expand-homepage-hero.mjs.

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_SEED_TOKEN,
  useCdn: false,
});

await client
  .patch('homePage')
  .unset([
    'hero.h1',
    'hero.primaryButtonLabel',
    'hero.primaryButtonPath',
    'hero.secondaryButtonLabel',
    'hero.secondaryButtonPath',
  ])
  .commit();

console.log('Contracted homePage.hero: old h1/primaryButtonLabel+Path/secondaryButtonLabel+Path fields removed.');
