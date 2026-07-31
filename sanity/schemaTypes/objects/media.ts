import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'media',
  title: 'Görsel',
  type: 'image',
  options: { hotspot: true },
  fields: [defineField({ name: 'alt', title: 'Alternatif Metin', type: 'string' })],
});
