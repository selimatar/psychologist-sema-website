import { createClient } from "@sanity/client";

// Content reads only (marketing copy) — separate from the backend's
// availability client, which uses useCdn: false because slot data must
// never be stale. Copy has no such correctness requirement, so this client
// uses the CDN for speed.
export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || "2024-01-01",
  useCdn: true,
});
