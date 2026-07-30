import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({ name: 'metaTitle', title: 'Meta Başlık', type: 'string' }),
    defineField({ name: 'metaDescription', title: 'Meta Açıklama', type: 'text' }),
    defineField({ name: 'ogImage', title: 'Paylaşım Görseli', type: 'media' }),
  ],
});
