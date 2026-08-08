// One-time content seed: populates the 5 singleton documents + 6 service
// documents with the exact Turkish copy that was hardcoded in the frontend
// before the Sanity migration, so the cutover is lossless. Safe to re-run
// (createOrReplace, fixed _ids). Never invoked by the running app.
//
// Usage: node --env-file=.env seed.mjs
// Requires SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET, and
// SANITY_SEED_TOKEN (an Editor token from manage.sanity.io — API section —
// never committed, never shipped to the browser) in sanity/.env.

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_SEED_TOKEN,
  useCdn: false,
});

const ctaBanner = (title, subtitle, buttonLabel) => ({ title, subtitle, buttonLabel });

const documents = [
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteTitle: 'Psk. Sema Azab',
    navLinks: [
      { _key: 'home', label: 'Ana Sayfa', path: '/' },
      { _key: 'about', label: 'Hakkımda', path: '/about' },
      { _key: 'services', label: 'Hizmetler', path: '/services' },
      { _key: 'contact', label: 'İletişim', path: '/contact' },
    ],
    ctaButtonLabel: 'Randevu Al',
    footerBrandTitle: 'Psk. Sema Azab',
    footerBrandSubtitle: 'Lisanslı Klinik Psikolog',
    footerTagline: 'Kaygı, stres ve yaşamın zorlu geçişleri için çevrimiçi psikoterapi.',
    footerExploreLinks: [
      { _key: 'home', label: 'Ana Sayfa', path: '/' },
      { _key: 'about', label: 'Hakkımda', path: '/about' },
      { _key: 'services', label: 'Hizmetler', path: '/services' },
      { _key: 'faq', label: 'SSS', path: '/contact#faq' },
    ],
    footerStartLinks: [
      { _key: 'contact', label: 'İletişime Geçin', path: '/contact' },
      { _key: 'book', label: 'Ücretsiz Görüşme Talep Edin', path: '/contact' },
    ],
    footerInfoLines: [
      'Sadece çevrimiçi seanslar',
      'Özel ödeme, fatura (superbill) sağlanır',
      'Doktora, Klinik Psikoloji',
    ],
    copyrightBusinessName: 'Psk. Sema Azab, Psikoloji Muayenehanesi',
    crisisLineText:
      "Bir kriz yaşıyorsanız, lütfen 112'i veya bulunduğunuz bölgedeki acil yardım hattını arayın.",
  },
  {
    _id: 'homePage',
    _type: 'homePage',
    hero: {
      eyebrow: 'Çevrimiçi Psikoterapi',
      h1: 'İçinizi ağırlaştıran şeyleri işlemek için daha sakin bir alan',
      paragraph:
        'Kaygı, stres ve yaşamın zorlu geçişleri için bireysel terapi — kendi hızınızda, çevrimiçi olarak sunulan istikrarlı ve kanıta dayalı destek.',
      primaryButtonLabel: 'Ücretsiz Görüşme Talep Et',
      primaryButtonPath: '/contact',
      secondaryButtonLabel: 'Seanslar nasıl işliyor',
      secondaryButtonPath: '/services',
      trustStripItems: [
        'Lisanslı Klinik Psikolog',
        '12+ Yıllık Deneyim',
        'Gizli ve Güvenli Seanslar',
        'Çevrimiçi, Ülkenin Her Yerinden',
      ],
    },
    aboutTeaser: {
      eyebrow: 'Psk. Azab Hakkında',
      h2: 'Karşınızda değil, yanınızda duran biri',
      paragraph:
        'Bu muayenehaneyi, terapinin klinik bir engelden çok, gerçekten yanınızda olan biriyle yapılan bir sohbet gibi hissettirmesini istediğim için kurdum. Yaklaşımım, bilişsel-davranışçı ve psikodinamik eğitimi, nereden başlarsanız başlayın gösterdiğim gerçek bir sabırla birleştiriyor.',
      linkText: 'Geçmişim hakkında daha fazlasını oku',
    },
    servicesTeaser: {
      eyebrow: 'Odak Alanları',
      h2: 'Yaşadığınız süreçte yanınızdayım',
      paragraph:
        'Her insanın hikâyesi farklıdır — bunlar sadece insanlara en sık başlangıç noktası olarak yardımcı olduğum alanlar.',
      linkText: 'Tüm odak alanlarını ve seansların nasıl işlediğini gör',
    },
    testimonial: {
      quote:
        'Doğru kelimelere sahip olmanıza ya da neyin yanlış olduğunu bilmenize gerek yok. Sadece olduğunuz gibi gelmeniz yeterli — gerisini birlikte çözeceğiz.',
      attribution: 'Psk. Sema Azab',
    },
    faqTeaser: {
      eyebrow: 'Pratik Detayları mı Merak Ediyorsunuz?',
      h2: 'Ücretler, gizlilik ve seansların işleyişi',
      paragraph: 'İnsanların ilk seanstan önce sorduğu ortak sorular — açık ve net yanıtlarla.',
      linkText: "SSS'yi ziyaret et",
    },
    ctaBanner: ctaBanner(
      'İletişime geçmek genellikle en zor kısımdır',
      'Ücretsiz 15 dakikalık görüşme, bunun sizin için doğru olup olmadığını görmenin baskısız bir yoludur — herhangi bir taahhüt gerektirmez.',
      'Ücretsiz Görüşme Talep Et'
    ),
  },
  {
    _id: 'aboutPage',
    _type: 'aboutPage',
    eyebrow: 'Hakkımda',
    title: 'Psk. Sema Azab',
    credentialLine: 'Lisanslı Klinik Psikolog · 12+ yıllık deneyim',
    bioParagraphs: [
      'Bu muayenehaneyi, terapinin klinik bir engelden çok, yanınızda olan biriyle yapılan bir sohbet gibi hissettirmesini istediğim için kurdum. Eğitimim bilişsel-davranışçı ve psikodinamik yaklaşımlar üzerine olsa da, her seansa rehberlik eden şey daha basit: merak, sabır ve taşıdıklarınıza gerçek bir saygı.',
      'Seanslar dışında kaygı tedavisi üzerine yazıyor ve danışmanlık veriyorum, travma bilinçli bakım konusunda eğitimlerime devam ediyorum. Klinik Psikoloji alanında doktora derecesine sahibim ve çevrimiçi olarak ülke genelinde uygulama yapmaya yetkiliyim.',
    ],
    credentials: [
      { _key: 'egitim', label: 'Eğitim', value: 'Doktora, Klinik Psikoloji' },
      { _key: 'lisans', label: 'Lisans', value: 'Lisanslı Psikolog' },
      { _key: 'format', label: 'Format', value: 'Sadece çevrimiçi seanslar' },
    ],
    approach: {
      eyebrow: 'Yaklaşımım',
      title: 'Bulunduğunuz yerde sizinle buluşan bir terapi',
      paragraphs: [
        'Herkese uyan tek bir yaklaşıma inanmıyorum. Kimi insanlar seanslar arasında uygulayabilecekleri yapılandırılmış araçlar ister; kimileri ise her şeyden önce sadece dinlenmeye ihtiyaç duyar. Birlikte yürüteceğimiz çalışma, sizin ihtiyacınıza göre şekillenecek — sizin öncülüğünüzü takip ederken, tıkandığınız noktalardan çıkmanıza yardımcı olacak klinik zemini de sunuyorum.',
        'Her şeyden önce, seanslarımızın iyi olduğunuzu göstermek zorunda olmadığınız bir alan olmasını istiyorum. Getirdiğiniz her şey — dağınıklık, belirsizlik, çelişkiler — kabul görür.',
      ],
    },
    ctaBanner: ctaBanner(
      'Birbirimize uygun olup olmadığımızı merak mı ediyorsunuz?',
      'Ücretsiz 15 dakikalık görüşme, bunu öğrenmenin en kolay yolu.',
      'Ücretsiz Görüşme Talep Et'
    ),
  },
  {
    _id: 'servicesPage',
    _type: 'servicesPage',
    eyebrow: 'Odak Alanları',
    title: 'Yaşadığınız süreçte yanınızdayım',
    paragraph:
      'Her insanın hikâyesi farklıdır — bunlar sadece insanlara en sık başlangıç noktası olarak yardımcı olduğum alanlar.',
    howItWorks: { eyebrow: 'Nasıl İşliyor', title: 'İlk adımdan itibaren neler olacak' },
    approachSteps: [
      { _key: 'step1', title: 'İlk Adım', desc: 'İletişim formunu doldurarak ya da e-posta yoluyla bana ulaşırsınız.' },
      { _key: 'step2', title: 'Ön Görüşme', desc: '15-20 dakikalık kısa bir görüşmeyle birbirimizi tanır, uygunluğu değerlendiririz.' },
      { _key: 'step3', title: 'İlk Seans', desc: '50 dakikalık ilk seansta sizi dinler, birlikte bir yol haritası çıkarırız.' },
      { _key: 'step4', title: 'Gizlilik', desc: 'Paylaştığınız her şey gizli kalır; güven bu sürecin en önemli temelidir.' },
      { _key: 'step5', title: 'Süreklilik', desc: 'Haftalık ya da iki haftalık düzenli seanslarla, kendi hızınızda ilerleriz.' },
    ],
    ctaBanner: ctaBanner(
      'Durumunuza hangi alanın uyduğundan emin değil misiniz?',
      'Ücretsiz görüşme tam olarak bunun için var.',
      'Ücretsiz Görüşme Talep Et'
    ),
  },
  {
    _id: 'contactPage',
    _type: 'contactPage',
    eyebrow: 'Bize Ulaşın',
    title: 'İletişime geçmek genellikle en zor kısımdır',
    paragraph:
      'Aşağıya kısa bir not bırakın, ücretsiz 15 dakikalık görüşmeyi ayarlamak için bir iş günü içinde size dönüş yapacağım — herhangi bir taahhüt yok, sadece doğru olup olmadığını görme fırsatı.',
    nextSteps: {
      heading: 'Sırada ne var',
      steps: [
        'Ücretsiz görüşmeniz için bir zaman onaylamak üzere bir iş günü içinde size dönüş yapacağım.',
        'Sizi buraya getiren şey hakkında biraz bilgi alabilmem için yaklaşık 15 dakika konuşacağız.',
        'Uygun bir eşleşme gibi hissettirirse, size uygun bir zamanda çevrimiçi olarak ilk tam seansınızı planlayacağız.',
      ],
    },
    assuranceBullets: [
      'Sadece güvenli video görüşmesi üzerinden çevrimiçi seanslar.',
      'Burada paylaştığınız her şey gizlidir ve yalnızca görüşmenizi ayarlamak için kullanılır.',
      'Özel ödemeli muayenehane — ağ dışı geri ödeme için bir fatura (superbill) sağlanır.',
    ],
    successState: {
      heading: 'Teşekkür ederim',
      paragraphs: [
        'Mesajınız alındı. Bir iş günü içinde sizinle iletişime geçeceğim.',
        'Rezervasyon onaylandığında size bilgi verilecektir. Şimdi lütfen bilgi formunu doldurunuz.',
      ],
      buttonLabel: 'Bilgi Formunu Doldur',
    },
    formLabels: {
      nameLabel: 'Adınız ve Soyadınız',
      emailLabel: 'E-posta',
      emailPlaceholder: 'ornek@mail.com',
      topicLabel: 'Hangi konuda destek almak istersiniz?',
      topicPlaceholder: 'Bir alan seçin (isteğe bağlı)',
      slotLabel: 'Uygun bir saat seçin',
      notesLabel: 'Bilmemi istediğiniz başka bir şey var mı?',
      notesPlaceholder: 'İstediğiniz kadar az ya da çok paylaşabilirsiniz',
      submitLabel: 'Ücretsiz Görüşme Talep Et',
      submitNote: 'Ödeme gerekmez. Bu, baskısız bir ilk adımdır.',
    },
    faqSection: { eyebrow: 'SSS', title: 'Sık sorulan sorular' },
    faqs: [
      {
        _key: 'faq1',
        q: 'Sigorta kabul ediyor musunuz?',
        a: 'Bu özel ödemeli bir muayenehanedir; bu da birlikte nasıl çalışacağımız konusunda daha fazla esneklik sağlar. Her seanstan sonra, sigortanıza sunarak olası ağ dışı geri ödeme alabileceğiniz bir fatura (superbill) veriyorum.',
      },
      {
        _key: 'faq2',
        q: 'Paylaştığım her şey gizli mi kalıyor?',
        a: 'Evet. Seans içeriği terapist-danışan gizliliğiyle korunur ve yasanın gerektirdiği nadir durumlar dışında (acil güvenlik endişeleri gibi) yazılı onayınız olmadan asla paylaşılmaz.',
      },
      {
        _key: 'faq3',
        q: 'Seanslar ne kadar sürüyor ve ne sıklıkla görüşüyoruz?',
        a: 'Seanslar 50 dakikadır. Çoğu danışan haftalık başlar ve işler daha oturdukça iki haftada bir geçer; neyin faydalı olduğuna göre birlikte karar veririz.',
      },
      {
        _key: 'faq4',
        q: 'Yüz yüze mi yoksa çevrimiçi mi seanslar sunuyorsunuz?',
        a: 'Seanslar şu anda yalnızca güvenli bir video platformu üzerinden çevrimiçi olarak sunulmaktadır; böylece size en rahat gelen yerden katılabilirsiniz.',
      },
      {
        _key: 'faq5',
        q: 'Ücretleriniz nedir?',
        a: 'Ücretler, uygun olduğunda sigorta geri ödemesi için bir fatura (superbill) ile birlikte ücretsiz görüşme sırasında paylaşılır. Başlamadan önce bunu açıkça konuşmaktan memnuniyet duyarım.',
      },
      {
        _key: 'faq6',
        q: 'İlk görüşmede neler oluyor?',
        a: 'Ücretsiz 15 dakikalık görüşme, sizi buraya getiren şeyi kısaca paylaşmak, sorularınızı sormak ve bunun uygun bir eşleşme olup olmadığını hissetmek için bir fırsattır; herhangi bir taahhüt baskısı olmadan.',
      },
    ],
  },
  {
    _id: 'service-anxiety',
    _type: 'service',
    title: 'Kaygı',
    description:
      'Hızla akan düşünceler, endişe ve kaygının getirdiği fiziksel ağırlık için pratik araçlar ve istikrarlı destek.',
    icon: 'anxiety',
    tint: 'sage',
    topicValue: 'anxiety',
    order: 0,
  },
  {
    _id: 'service-stress',
    _type: 'service',
    title: 'Stres Yönetimi',
    description: 'Bunalmışlık hissini anlamlandırmak ve günlük baskıyla başa çıkmanın sürdürülebilir yollarını oluşturmak.',
    icon: 'stress',
    tint: 'terracotta',
    topicValue: 'stress',
    order: 1,
  },
  {
    _id: 'service-transitions',
    _type: 'service',
    title: 'Yaşam Geçişleri',
    description: 'Kariyer değişiklikleri, ilişki değişimleri, taşınma veya her türlü yeni dönem için destek.',
    icon: 'transitions',
    tint: 'sage',
    topicValue: 'transitions',
    order: 2,
  },
  {
    _id: 'service-grief',
    _type: 'service',
    title: 'Yas',
    description: 'Kaybı kendi hızınızda, zaman çizelgesi olmadan işlemek için nazik ve acelesiz bir alan.',
    icon: 'grief',
    tint: 'terracotta',
    topicValue: 'grief',
    order: 3,
  },
  {
    _id: 'service-depression',
    _type: 'service',
    title: 'Depresyon',
    description: 'Düşük ruh halini anlamak ve yeniden bir ivme ve anlam duygusu inşa etmek için birlikte çalışmak.',
    icon: 'depression',
    tint: 'sage',
    topicValue: 'depression',
    order: 4,
  },
  {
    _id: 'service-trauma',
    _type: 'service',
    title: 'Travma',
    description: 'Kendinizi güvende hissettiğiniz bir hızda ilerleyen, asla aceleye getirilmeyen travma bilinçli bakım.',
    icon: 'trauma',
    tint: 'terracotta',
    topicValue: 'trauma',
    order: 5,
  },
];

async function run() {
  if (!process.env.SANITY_STUDIO_PROJECT_ID) {
    throw new Error('SANITY_STUDIO_PROJECT_ID is not set (check sanity/.env)');
  }
  if (!process.env.SANITY_SEED_TOKEN) {
    throw new Error('SANITY_SEED_TOKEN is not set (check sanity/.env)');
  }

  for (const doc of documents) {
    await client.createOrReplace(doc);
    console.log(`Seeded ${doc._id}`);
  }
  console.log('Done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
