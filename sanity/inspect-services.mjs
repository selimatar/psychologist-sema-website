// Read-only inventory of every `service` document in the live dataset —
// no write token needed, reads are anonymous/public. Run this before any
// migration/rollback so we can see exactly what's live, including any
// documents the editor created herself in Studio.
//
// Usage: node --env-file=.env inspect-services.mjs

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function run() {
  if (!process.env.SANITY_STUDIO_PROJECT_ID) {
    throw new Error('SANITY_STUDIO_PROJECT_ID is not set (check sanity/.env)');
  }

  const docs = await client.fetch(
    `*[_type == "service"] | order(order asc) {
      _id, _createdAt, _updatedAt, title, description, icon, tint, topicValue, order
    }`
  );

  console.log(JSON.stringify(docs, null, 2));
  console.log(`\nTotal: ${docs.length} service documents.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
