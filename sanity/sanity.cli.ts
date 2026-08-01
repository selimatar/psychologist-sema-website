import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  studioHost: 'sema-psikolog',
  deployment: {
    appId: 'wrmv3r91xovgu9mi5e7g880q',
  },
});
