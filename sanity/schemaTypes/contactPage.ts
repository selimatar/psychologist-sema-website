import { defineField, defineType } from 'sanity';
import { pageHeaderFields } from './fields/pageHeaderFields';

export default defineType({
  name: 'contactPage',
  title: 'İletişim Sayfası',
  type: 'document',
  fields: [
    ...pageHeaderFields,
    defineField({
      name: 'nextSteps',
      title: '"Sırada Ne Var" Kartı',
      type: 'object',
      fields: [
        defineField({ name: 'heading', title: 'Başlık', type: 'string' }),
        defineField({
          name: 'steps',
          title: 'Adımlar',
          type: 'array',
          of: [{ type: 'string' }],
        }),
      ],
    }),
    defineField({
      name: 'assuranceBullets',
      title: 'Güvence Maddeleri',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'successState',
      title: 'Gönderim Sonrası Ekran',
      type: 'object',
      fields: [
        defineField({ name: 'heading', title: 'Başlık', type: 'string' }),
        defineField({
          name: 'paragraphs',
          title: 'Paragraflar',
          type: 'array',
          of: [{ type: 'string' }],
        }),
        defineField({ name: 'buttonLabel', title: 'Buton Yazısı', type: 'string' }),
      ],
    }),
    defineField({
      name: 'formLabels',
      title: 'Form Etiketleri',
      type: 'object',
      fields: [
        defineField({ name: 'nameLabel', title: 'Ad Alanı Etiketi', type: 'string' }),
        defineField({ name: 'emailLabel', title: 'E-posta Alanı Etiketi', type: 'string' }),
        defineField({ name: 'emailPlaceholder', title: 'E-posta Yer Tutucusu', type: 'string' }),
        defineField({ name: 'topicLabel', title: 'Konu Alanı Etiketi', type: 'string' }),
        defineField({ name: 'topicPlaceholder', title: 'Konu Yer Tutucusu', type: 'string' }),
        defineField({ name: 'slotLabel', title: 'Saat Seçimi Etiketi', type: 'string' }),
        defineField({ name: 'notesLabel', title: 'Not Alanı Etiketi', type: 'string' }),
        defineField({ name: 'notesPlaceholder', title: 'Not Yer Tutucusu', type: 'string' }),
        defineField({ name: 'submitLabel', title: 'Gönder Butonu Yazısı', type: 'string' }),
        defineField({ name: 'submitNote', title: 'Gönder Butonu Alt Notu', type: 'string' }),
      ],
    }),
    defineField({ name: 'faqSection', title: 'SSS Bölüm Başlığı', type: 'sectionHeader' }),
    defineField({
      name: 'faqs',
      title: 'Sıkça Sorulan Sorular',
      type: 'array',
      description: 'Sıralama önemlidir; ilk soru sayfada açık gösterilir.',
      of: [{ type: 'faqItem' }],
    }),
    defineField({ name: 'ctaBanner', title: 'Çağrı Bandı (CTA)', type: 'ctaBanner' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'İletişim Sayfası' }),
  },
});
