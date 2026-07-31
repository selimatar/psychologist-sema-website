const { createClient } = require('@sanity/client');
const config = require('../config');

// useCdn: false — availability must reflect the psychologist's edits
// immediately (blocked days, hour changes), and at ~20 req/week the CDN's
// caching benefit is irrelevant anyway.
const sanityClient = createClient({
  projectId: config.sanityProjectId,
  dataset: config.sanityDataset,
  apiVersion: config.sanityApiVersion,
  useCdn: false,
  token: config.sanityReadToken || undefined,
});

module.exports = sanityClient;
