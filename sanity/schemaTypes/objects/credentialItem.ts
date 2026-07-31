import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'credentialItem',
  title: 'Eğitim / Unvan Bilgisi',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Etiket', type: 'string' }),
    defineField({ name: 'value', title: 'Değer', type: 'string' }),
  ],
});
