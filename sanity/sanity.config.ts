import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

const SINGLETONS = [
  { id: 'siteSettings', type: 'siteSettings', title: 'Site Ayarları' },
  { id: 'homePage', type: 'homePage', title: 'Ana Sayfa' },
  { id: 'aboutPage', type: 'aboutPage', title: 'Hakkımda Sayfası' },
  { id: 'servicesPage', type: 'servicesPage', title: 'Hizmetler Sayfası' },
  { id: 'contactPage', type: 'contactPage', title: 'İletişim Sayfası' },
];

const singletonTypeNames = new Set(SINGLETONS.map((s) => s.type));

export default defineConfig({
  name: 'default',
  title: 'Sema Psikolog — İçerik Yönetimi',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('İçerik')
          .items([
            ...SINGLETONS.map((s) =>
              S.listItem()
                .id(s.id)
                .title(s.title)
                .child(S.document().schemaType(s.type).documentId(s.id))
            ),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => !singletonTypeNames.has(item.getId() || '')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
