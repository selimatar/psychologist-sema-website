import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'sectionHeader',
  title: 'Bölüm Başlığı',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Üst Etiket', type: 'string' }),
    defineField({ name: 'title', title: 'Başlık', type: 'string' }),
    defineField({ name: 'paragraph', title: 'Paragraf', type: 'text' }),
  ],
});
