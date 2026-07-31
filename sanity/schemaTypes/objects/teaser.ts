import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'teaser',
  title: 'Tanıtım Bölümü',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Üst Etiket', type: 'string' }),
    defineField({ name: 'h2', title: 'Başlık', type: 'string' }),
    defineField({ name: 'paragraph', title: 'Paragraf', type: 'text' }),
    defineField({ name: 'linkText', title: 'Bağlantı Yazısı', type: 'string' }),
    defineField({ name: 'image', title: 'Görsel', type: 'media' }),
  ],
});
