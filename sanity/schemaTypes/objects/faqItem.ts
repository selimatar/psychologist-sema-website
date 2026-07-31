import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'faqItem',
  title: 'SSS Öğesi',
  type: 'object',
  fields: [
    defineField({ name: 'q', title: 'Soru', type: 'string' }),
    defineField({ name: 'a', title: 'Cevap', type: 'text' }),
  ],
});
