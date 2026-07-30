import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Ayarları',
  type: 'document',
  fields: [
    defineField({ name: 'siteTitle', title: 'Site Başlığı (Üst Menü)', type: 'string' }),
    defineField({
      name: 'navLinks',
      title: 'Ana Menü Bağlantıları',
      type: 'array',
      of: [{ type: 'link' }],
    }),
    defineField({ name: 'ctaButtonLabel', title: 'Üst Menü Buton Yazısı', type: 'string' }),
    defineField({ name: 'footerBrandTitle', title: 'Alt Bilgi Marka Başlığı', type: 'string' }),
    defineField({ name: 'footerBrandSubtitle', title: 'Alt Bilgi Marka Alt Başlığı', type: 'string' }),
    defineField({ name: 'footerTagline', title: 'Alt Bilgi Slogan', type: 'text' }),
    defineField({
      name: 'footerExploreLinks',
      title: 'Alt Bilgi "Keşfet" Bağlantıları',
      type: 'array',
      of: [{ type: 'link' }],
    }),
    defineField({
      name: 'footerStartLinks',
      title: 'Alt Bilgi "Başlayın" Bağlantıları',
      type: 'array',
      of: [{ type: 'link' }],
    }),
    defineField({
      name: 'footerInfoLines',
      title: 'Alt Bilgi "Uygulama Bilgileri" Satırları',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'copyrightBusinessName',
      title: 'Telif Hakkı İşletme Adı',
      type: 'string',
      description: 'Yıl otomatik hesaplanır, burada saklanmaz.',
    }),
    defineField({ name: 'crisisLineText', title: 'Kriz Hattı Uyarı Metni', type: 'text' }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Ayarları' }),
  },
});
