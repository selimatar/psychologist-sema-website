import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'ctaBanner',
  title: 'Çağrı Bandı (CTA)',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Başlık', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Alt Başlık', type: 'text' }),
    defineField({ name: 'buttonLabel', title: 'Buton Yazısı', type: 'string' }),
    defineField({ name: 'buttonPath', title: 'Buton Hedefi', type: 'string' }),
  ],
});
