import { defineField } from 'sanity';

// Shared field trio for page-root headers (about/services/contact) and
// homePage's hero. Spread directly into a parent's `fields: [...]` array
// rather than referenced as a nested object type, so these fields stay flat
// at the level they already live at — no extra JSON nesting, no migration.
export const pageHeaderFields = [
  defineField({ name: 'eyebrow', title: 'Üst Etiket', type: 'string' }),
  defineField({ name: 'title', title: 'Başlık', type: 'string' }),
  defineField({ name: 'paragraph', title: 'Paragraf', type: 'text' }),
];
