import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'approachStep',
  title: 'Süreç Adımı',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Başlık', type: 'string' }),
    defineField({ name: 'desc', title: 'Açıklama', type: 'text' }),
  ],
});
