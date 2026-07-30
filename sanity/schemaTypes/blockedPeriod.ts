import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'blockedPeriod',
  title: 'Kısıtlı Zaman Aralığı',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Etiket (opsiyonel, kendi referansınız için)',
      type: 'string',
    }),
    defineField({
      name: 'startAt',
      title: 'Başlangıç',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endAt',
      title: 'Bitiş',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reason',
      title: 'Sebep (opsiyonel)',
      type: 'string',
    }),
  ],
  validation: (Rule) =>
    Rule.custom((doc) => {
      if (!doc?.startAt || !doc?.endAt) return true;
      return doc.startAt < doc.endAt || 'Başlangıç, bitişten önce olmalıdır';
    }),
  preview: {
    select: { title: 'title', start: 'startAt', end: 'endAt' },
    prepare: ({ title, start, end }) => ({
      title: title || `${start} → ${end}`,
    }),
  },
});
