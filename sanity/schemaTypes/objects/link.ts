import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'link',
  title: 'Bağlantı',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Yazı', type: 'string' }),
    defineField({ name: 'path', title: 'Hedef Yol', type: 'string' }),
  ],
});
