import { defineField, defineType } from 'sanity';

const TOPIC_OPTIONS = [
  { title: 'Stres', value: 'stress' },
  { title: 'Aşırı Düşünme', value: 'overthinking' },
  { title: 'İlişki Problemleri', value: 'relationships' },
  { title: 'Yaşam Geçişleri', value: 'transitions' },
  { title: 'Erteleme', value: 'procrastination' },
  { title: 'Duygu Düzenleme', value: 'emotional_regulation' },
  { title: 'Kaygı', value: 'anxiety' },
  { title: 'Özgüven', value: 'self_confidence' },
];

export default defineType({
  name: 'service',
  title: 'Hizmet',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Simge',
      type: 'string',
      description: 'ServiceCard bileşeninde hangi çizimin gösterileceğini belirler.',
      options: { list: TOPIC_OPTIONS },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tint',
      title: 'Renk Tonu',
      type: 'string',
      description: 'Kart arka plan rengini belirler.',
      options: {
        list: [
          { title: 'Yeşil', value: 'sage' },
          { title: 'Turuncu', value: 'terracotta' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'topicValue',
      title: 'Randevu Formu Konu Değeri',
      type: 'string',
      description: 'Randevu formundaki "Hangi konuda destek almak istersiniz?" seçeneğiyle eşleşir.',
      options: { list: TOPIC_OPTIONS },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Sıralama',
      type: 'number',
      description: 'Küçükten büyüğe doğru sıralanır.',
      validation: (Rule) => Rule.required().integer(),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'icon' },
    prepare: ({ title, subtitle }) => ({ title: title || 'İsimsiz hizmet', subtitle }),
  },
});
