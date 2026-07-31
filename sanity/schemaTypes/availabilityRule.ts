import { defineField, defineType } from 'sanity';

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export default defineType({
  name: 'availabilityRule',
  title: 'Müsaitlik Durumu',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Etiket (opsiyonel, kendi referansınız için)',
      type: 'string',
    }),
    defineField({
      name: 'dayOfWeek',
      title: 'Haftanın günü',
      type: 'string',
      options: {
        list: [
          { title: 'Pazar', value: 'sunday' },
          { title: 'Pazartesi', value: 'monday' },
          { title: 'Salı', value: 'tuesday' },
          { title: 'Çarşamba', value: 'wednesday' },
          { title: 'Perşembe', value: 'thursday' },
          { title: 'Cuma', value: 'friday' },
          { title: 'Cumartesi', value: 'saturday' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startTime',
      title: 'Başlangıç saati (SS:DD)',
      type: 'string',
      description: '24 saat formatında, örn. 09:00',
      validation: (Rule) => Rule.required().regex(TIME_REGEX, { name: 'HH:MM' }),
    }),
    defineField({
      name: 'endTime',
      title: 'Bitiş saati (SS:DD)',
      type: 'string',
      description: '24 saat formatında, örn. 17:00',
      validation: (Rule) => Rule.required().regex(TIME_REGEX, { name: 'HH:MM' }),
    }),
    defineField({
      name: 'slotDurationMinutes',
      title: 'Randevu süresi (dakika)',
      type: 'number',
      options: { list: [15, 30, 45, 60, 90] },
      initialValue: 60,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Aktif',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  validation: (Rule) =>
    Rule.custom((doc) => {
      if (!doc?.startTime || !doc?.endTime) return true;
      return doc.endTime > doc.startTime || 'Bitiş saati, başlangıç saatinden sonra olmalıdır';
    }),
  preview: {
    select: { title: 'title', day: 'dayOfWeek', start: 'startTime', end: 'endTime' },
    prepare: ({ title, day, start, end }) => {
      const dayLabels: Record<string, string> = {
        sunday: 'Pazar',
        monday: 'Pazartesi',
        tuesday: 'Salı',
        wednesday: 'Çarşamba',
        thursday: 'Perşembe',
        friday: 'Cuma',
        saturday: 'Cumartesi',
      };
      return {
        title: title || `${dayLabels[day] || ''}: ${start}–${end}`,
      };
    },
  },
});
