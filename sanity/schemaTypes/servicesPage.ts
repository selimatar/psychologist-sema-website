import { defineField, defineType } from 'sanity';
import { pageHeaderFields } from './fields/pageHeaderFields';

export default defineType({
  name: 'servicesPage',
  title: 'Hizmetler Sayfası',
  type: 'document',
  fields: [
    ...pageHeaderFields,
    defineField({ name: 'howItWorks', title: '"Nasıl İşliyor" Bölüm Başlığı', type: 'sectionHeader' }),
    defineField({
      name: 'approachSteps',
      title: 'Süreç Adımları',
      type: 'array',
      description: 'Sıra numarası otomatik hesaplanır, dizideki sıralamaya göre gösterilir.',
      of: [{ type: 'approachStep' }],
    }),
    defineField({ name: 'ctaBanner', title: 'Çağrı Bandı (CTA)', type: 'ctaBanner' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Hizmetler Sayfası' }),
  },
});
