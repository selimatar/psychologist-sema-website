import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'homePage',
  title: 'Ana Sayfa',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Giriş Bölümü',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', title: 'Üst Etiket', type: 'string' }),
        defineField({ name: 'h1', title: 'Ana Başlık', type: 'string' }),
        defineField({ name: 'paragraph', title: 'Paragraf', type: 'text' }),
        defineField({ name: 'primaryButtonLabel', title: 'Birincil Buton Yazısı', type: 'string' }),
        defineField({ name: 'primaryButtonPath', title: 'Birincil Buton Yolu', type: 'string' }),
        defineField({ name: 'secondaryButtonLabel', title: 'İkincil Buton Yazısı', type: 'string' }),
        defineField({ name: 'secondaryButtonPath', title: 'İkincil Buton Yolu', type: 'string' }),
        defineField({
          name: 'trustStripItems',
          title: 'Güven Şeridi Öğeleri',
          type: 'array',
          of: [{ type: 'string' }],
        }),
        defineField({ name: 'image', title: 'Görsel', type: 'media' }),
      ],
    }),
    defineField({ name: 'aboutTeaser', title: 'Hakkımda Tanıtım Bölümü', type: 'teaser' }),
    defineField({ name: 'servicesTeaser', title: 'Hizmetler Tanıtım Bölümü', type: 'teaser' }),
    defineField({
      name: 'testimonial',
      title: 'Referans / Alıntı',
      type: 'object',
      fields: [
        defineField({ name: 'quote', title: 'Alıntı', type: 'text' }),
        defineField({ name: 'attribution', title: 'İmza', type: 'string' }),
      ],
    }),
    defineField({ name: 'faqTeaser', title: 'SSS Tanıtım Bölümü', type: 'teaser' }),
    defineField({ name: 'ctaBanner', title: 'Çağrı Bandı (CTA)', type: 'ctaBanner' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Ana Sayfa' }),
  },
});
