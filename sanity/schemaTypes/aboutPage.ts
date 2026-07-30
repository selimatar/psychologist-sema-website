import { defineField, defineType } from 'sanity';
import { pageHeaderFields } from './fields/pageHeaderFields';

export default defineType({
  name: 'aboutPage',
  title: 'Hakkımda Sayfası',
  type: 'document',
  fields: [
    ...pageHeaderFields,
    defineField({ name: 'credentialLine', title: 'Unvan Satırı', type: 'string' }),
    defineField({
      name: 'bioParagraphs',
      title: 'Biyografi Paragrafları',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Her öğe bir paragraf olarak gösterilir.',
    }),
    defineField({
      name: 'credentials',
      title: 'Eğitim / Unvan Bilgileri',
      type: 'array',
      of: [{ type: 'credentialItem' }],
    }),
    defineField({
      name: 'approach',
      title: 'Yaklaşımım Bölümü',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', title: 'Üst Etiket', type: 'string' }),
        defineField({ name: 'title', title: 'Başlık', type: 'string' }),
        defineField({
          name: 'paragraphs',
          title: 'Paragraflar',
          type: 'array',
          of: [{ type: 'string' }],
        }),
      ],
    }),
    defineField({ name: 'portrait', title: 'Portre Fotoğrafı', type: 'media' }),
    defineField({ name: 'ctaBanner', title: 'Çağrı Bandı (CTA)', type: 'ctaBanner' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Hakkımda Sayfası' }),
  },
});
