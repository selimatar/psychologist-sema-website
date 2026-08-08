// Content seed: populates the 5 singleton documents + service documents.
// Originally a one-time, lossless migration of the pre-Sanity hardcoded
// copy (see git history for that version); since then the psychologist has
// rewritten most of the copy directly in Studio (new bio, new pricing/CTA
// model, expanded FAQ, real photos), so this file was refreshed on
// 2026-08-08 by fetching the live dataset and mirroring it here — this is
// now a point-in-time *backup/restore* snapshot of Studio content, not the
// original pre-migration copy. Re-run this refresh (fetch live docs, paste
// back into this file) whenever this file is suspected to have drifted from
// what's actually live in Studio, since nothing keeps the two in sync
// automatically. Safe to run (createOrReplace, fixed _ids where the
// document was originally seeded; two `service` docs below were created
// directly in Studio and so keep their Studio-assigned UUID _ids instead).
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
const media = (assetRef, alt) => ({
  _type: 'media',
  ...(alt ? { alt } : {}),
  asset: { _type: 'reference', _ref: assetRef },
});

// Portrait/hero photo — same image reused across homePage hero, aboutPage
// portrait, and both pages' og:image.
const PORTRAIT_ASSET = 'image-7825f9461e53fe8f87e4e2ef51f46589b5309eec-1254x1254-jpg';
const ABOUT_TEASER_ASSET = 'image-8b84a85b41954a43a27a84f1674814a78a590269-1206x1504-jpg';

const documents = [
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteTitle: 'Psikolog Sema Azab',
    navLinks: [
      { _key: 'home', label: 'Ana Sayfa', path: '/' },
      { _key: 'about', label: 'Hakkımda', path: '/about' },
      { _key: 'services', label: 'Hizmetler', path: '/services' },
      { _key: 'contact', label: 'İletişim', path: '/contact' },
    ],
    ctaButtonLabel: 'Randevu Al',
    footerBrandTitle: 'Psikolog Sema Azab',
    footerBrandSubtitle: 'Değişimin başladığı yer, kendini anlamaktır.',
    footerTagline: 'Değişim, kendine doğru atılan ilk adımla başlar. Bu yolculukta sana eşlik etmek için buradayım.',
    footerExploreLinks: [
      { _key: 'home', label: 'Ana Sayfa', path: '/' },
      { _key: 'about', label: 'Hakkımda', path: '/about' },
      { _key: 'services', label: 'Hizmetler', path: '/services' },
      { _key: 'faq', label: 'SSS', path: '/contact#faq' },
    ],
    footerStartLinks: [{ _key: 'contact', label: 'İletişime Geçin', path: '/contact' }],
    footerInfoLines: ['Sadece çevrimiçi seanslar'],
    copyrightBusinessName: 'Psk. Sema Azab, psikoloji',
    crisisLineText:
      "Bir kriz yaşıyorsanız, lütfen 112'i veya bulunduğunuz bölgedeki acil yardım hattını arayın.",
  },
  {
    _id: 'homePage',
    _type: 'homePage',
    hero: {
      eyebrow: 'BİREYSEL PSİKOLOJİK DANIŞMANLIK',
      h1: 'Değişimin başladığı yer, kendini anlamaktır.',
      paragraph: 'Değişim, kendine doğru atılan ilk adımla başlar. Bu yolculukta sana eşlik etmek için buradayım.',
      primaryButtonLabel: 'Randevu Al',
      primaryButtonPath: '/contact',
      secondaryButtonLabel: 'Seanslar nasıl işliyor',
      secondaryButtonPath: '/services#how-it-works',
      trustStripItems: ['Psikolog Sema Azab'],
      image: media(PORTRAIT_ASSET, 'Psikolog Sema Azab'),
    },
    aboutTeaser: {
      eyebrow: 'Psk. Azab Hakkında',
      h2: 'Karşınızda değil, yanınızda duran biri',
      paragraph:
        'Danışanlarımla çalışmalarımı ağırlıklı olarak Bilişsel Davranışçı Terapi (BDT) yaklaşımı doğrultusunda yürütüyor, ihtiyaç duyulan durumlarda Şema Terapi bakış açısından da yararlanıyorum. Terapi sürecinde yalnızca yaşanan güçlükleri değil; bu güçlükleri sürdüren düşünce, duygu ve davranış örüntülerini birlikte anlamayı önemsiyorum. Amacım, danışanlarımın yaşadıkları zorlukları daha iyi anlamalarına ve yaşamlarında daha işlevsel değişimler oluşturabilmelerine bilimsel temellere dayanan bir yaklaşımla destek olmaktır.',
      linkText: 'Geçmişim hakkında daha fazlasını oku',
      image: media(ABOUT_TEASER_ASSET),
    },
    servicesTeaser: {
      eyebrow: 'Odak Alanları',
      h2: 'Yaşadığınız süreçte yanınızdayım',
      paragraph:
        'Her insanın hikâyesi farklıdır, bunlar sadece insanlara en sık başlangıç noktası olarak yardımcı olduğum alanlar.',
      linkText: 'Tüm odak alanlarını ve seansların nasıl işlediğini gör',
    },
    testimonial: {
      quote:
        'Doğru kelimelere sahip olmanıza ya da neyin yanlış olduğunu bilmenize gerek yok. Sadece olduğunuz gibi gelmeniz yeterli, gerisini birlikte çözeceğiz.',
      attribution: 'Psk. Sema Azab',
    },
    faqTeaser: {
      eyebrow: 'Pratik Detayları mı Merak Ediyorsunuz?',
      h2: 'Ücretler, gizlilik ve seansların işleyişi',
      paragraph: 'İnsanların ilk seanstan önce sorduğu ortak sorular, açık ve net yanıtlarla.',
      linkText: "SSS'yi ziyaret et",
    },
    ctaBanner: ctaBanner(
      'Kendinizi anlamaya giden yol, bazen tek bir adımla başlar.',
      'İhtiyacınıza uygun bir görüşme planlamak için şimdi randevunuzu oluşturabilirsiniz.',
      'Randevu Al'
    ),
    seo: {
      _type: 'seo',
      metaTitle: 'Psk. Sema Azab | Çevrimiçi Psikoterapi ve Danışmanlık',
      metaDescription:
        'Kaygı, stres ve yaşamın zorlu geçişleri için çevrimiçi bireysel terapi. Lisanslı klinik psikolog Sema Azab ile ücretsiz 15 dakikalık ön görüşme talep edin.',
      ogImage: media(PORTRAIT_ASSET, 'Psk. Sema Azab'),
    },
  },
  {
    _id: 'aboutPage',
    _type: 'aboutPage',
    eyebrow: 'Hakkımda',
    title: 'Psk. Sema Azab',
    paragraph:
      'Merhaba, ben Psikolog Sema Azab.\n\n2021 yılında İstanbul Arel Üniversitesi Psikoloji Bölümü’nde başladığım lisans eğitimimi, 2025 yılında Onur Öğrencisi olarak tamamladım. Psikoloji alanındaki güncel gelişmeleri takip etmeyi ve mesleki gelişimimi sürekli sürdürmeyi önemsiyorum. Bu doğrultuda Bilişsel Davranışçı Terapi (BDT), Şema Terapi, EMDR, Oyun Terapisi ile psikolojik değerlendirme alanlarında çeşitli eğitimler aldım.\n\nDanışanlarımla çalışmalarımı ağırlıklı olarak Bilişsel Davranışçı Terapi (BDT) yaklaşımı doğrultusunda yürütüyor, ihtiyaç duyulan durumlarda Şema Terapi bakış açısından da yararlanıyorum. Terapi sürecinde yalnızca yaşanan güçlükleri değil; bu güçlükleri sürdüren düşünce, duygu ve davranış örüntülerini birlikte anlamayı önemsiyorum. Amacım, danışanlarımın yaşadıkları zorlukları daha iyi anlamalarına ve yaşamlarında daha işlevsel değişimler oluşturabilmelerine bilimsel temellere dayanan bir yaklaşımla destek olmaktır.\n\nÇalışma alanlarım arasında kaygı, stres, özgüven sorunları, ilişkisel problemler, duygu düzenleme güçlükleri, erteleme davranışı, yaşam olaylarına uyum süreçleri ve kişisel gelişim yer almaktadır. Her bireyin yaşam öyküsünün, ihtiyaçlarının ve hedeflerinin birbirinden farklı olduğuna inanıyor; bu nedenle terapi sürecini kişiye özel, iş birliği içinde ve bilimsel temellere dayalı olarak planlıyorum.\n\nPsikolog kimliğimin yanı sıra, psikolojiyi daha anlaşılır ve ulaşılabilir hâle getirmeyi amaçlayan içerikler üretiyorum. Sosyal medyada oluşturduğumuz topluluk benim için yalnızca takipçi sayılarından ibaret değil; insanların kendilerini ifade ettikleri, yaşadıkları zorlukları paylaştıkları ve çoğu zaman “Ben de böyle hissediyorum.” diyebildikleri çok kıymetli bir alan. Bana ulaşan her mesaj, doğru zamanda kurulan bir cümlenin bile insanın hayatına dokunabileceğini ve anlaşılmanın ne kadar iyileştirici olabileceğini bana yeniden hatırlatıyor.\n\nBelki bu sayfaya sosyal medya içeriklerim aracılığıyla ulaştınız, belki de ilk kez burada karşılaşıyoruz. Nasıl tanışmış olursak olalım, terapi sürecinde en çok önem verdiğim şey; kendinizi rahatça ifade edebileceğiniz, anlaşılmış hissedebileceğiniz ve birlikte güvene dayalı bir çalışma ilişkisi kurabilmektir.\n\nTerapiye başlamak her zaman kolay bir karar olmayabilir. Ancak bazen insanın kendisi için attığı en önemli adım, yardım istemeye karar verdiği andır. Eğer siz de kendinizi daha yakından tanımak, yaşadığınız güçlükleri anlamlandırmak ve yaşamınızda daha sağlıklı değişimler oluşturmak istiyorsanız, bu yolculukta size eşlik etmekten memnuniyet duyarım.',
    bioParagraphs: [
      'Merhaba, ben Psikolog Sema Azab.  2021 yılında İstanbul Arel Üniversitesi Psikoloji Bölümü’nde başladığım lisans eğitimimi, 2025 yılında Onur Öğrencisi olarak tamamladım. Psikoloji alanındaki güncel gelişmeleri takip etmeyi ve mesleki gelişimimi sürekli sürdürmeyi önemsiyorum. Bu doğrultuda Bilişsel Davranışçı Terapi (BDT), Şema Terapi, EMDR, Oyun Terapisi ile psikolojik değerlendirme alanlarında çeşitli eğitimler aldım.',
      'Danışanlarımla çalışmalarımı ağırlıklı olarak Bilişsel Davranışçı Terapi (BDT) yaklaşımı doğrultusunda yürütüyor, ihtiyaç duyulan durumlarda Şema Terapi bakış açısından da yararlanıyorum. Terapi sürecinde yalnızca yaşanan güçlükleri değil; bu güçlükleri sürdüren düşünce, duygu ve davranış örüntülerini birlikte anlamayı önemsiyorum. Amacım, danışanlarımın yaşadıkları zorlukları daha iyi anlamalarına ve yaşamlarında daha işlevsel değişimler oluşturabilmelerine bilimsel temellere dayanan bir yaklaşımla destek olmaktır.',
      'Çalışma alanlarım arasında kaygı, stres, özgüven sorunları, ilişkisel problemler, duygu düzenleme güçlükleri, erteleme davranışı, yaşam olaylarına uyum süreçleri ve kişisel gelişim yer almaktadır. Her bireyin yaşam öyküsünün, ihtiyaçlarının ve hedeflerinin birbirinden farklı olduğuna inanıyor; bu nedenle terapi sürecini kişiye özel, iş birliği içinde ve bilimsel temellere dayalı olarak planlıyorum.',
      'Psikolog kimliğimin yanı sıra, psikolojiyi daha anlaşılır ve ulaşılabilir hâle getirmeyi amaçlayan içerikler üretiyorum. Sosyal medyada oluşturduğumuz topluluk benim için yalnızca takipçi sayılarından ibaret değil; insanların kendilerini ifade ettikleri, yaşadıkları zorlukları paylaştıkları ve çoğu zaman “Ben de böyle hissediyorum.” diyebildikleri çok kıymetli bir alan. Bana ulaşan her mesaj, doğru zamanda kurulan bir cümlenin bile insanın hayatına dokunabileceğini ve anlaşılmanın ne kadar iyileştirici olabileceğini bana yeniden hatırlatıyor.',
      'Belki bu sayfaya sosyal medya içeriklerim aracılığıyla ulaştınız, belki de ilk kez burada karşılaşıyoruz. Nasıl tanışmış olursak olalım, terapi sürecinde en çok önem verdiğim şey; kendinizi rahatça ifade edebileceğiniz, anlaşılmış hissedebileceğiniz ve birlikte güvene dayalı bir çalışma ilişkisi kurabilmektir.  Terapiye başlamak her zaman kolay bir karar olmayabilir. Ancak bazen insanın kendisi için attığı en önemli adım, yardım istemeye karar verdiği andır. Eğer siz de kendinizi daha yakından tanımak, yaşadığınız güçlükleri anlamlandırmak ve yaşamınızda daha sağlıklı değişimler oluşturmak istiyorsanız, bu yolculukta size eşlik etmekten memnuniyet duyarım.',
    ],
    credentials: [
      { _key: 'egitim', label: 'Lisans Eğitimi', value: 'İstanbul Arel Üniversitesi Psikoloji Bölümü (2021–2025)' },
      { _key: 'lisans', label: 'Terapi Yaklaşımım', value: 'Bilişsel Davranışçı Terapi (BDT)' },
      { _key: 'format', label: 'Mesleki Eğitimler', value: 'Bilişsel Davranışçı Terapi (BDT), Şema Terapi,  EMDR, Oyun Terapisi' },
      {
        _key: 'dcb5069889df',
        _type: 'credentialItem',
        label: 'Çalışma Alanlarım',
        value:
          'Kaygı Bozuklukları, Depresyon, OKB, Sosyal Kaygı, Panik Atak, Özgüven Sorunları, İlişki Problemleri, Duygu Düzenleme, Erteleme ve Mükemmeliyetçilik,  Stres ve Tükenmişlik',
      },
      {
        _key: 'bfc9db57c53d',
        _type: 'credentialItem',
        label: 'Görüşmeler',
        value: 'Online Bireysel Terapi, Ergen & Yetişkin',
      },
      {
        _key: 'd40ca424b2f7',
        _type: 'credentialItem',
        label: 'Dijital Psikoloji Platformu',
        value:
          '@psikologsemaazab Psikolojiyi daha ulaşılabilir hâle getirmek amacıyla içerikler üretiyor, geniş bir dijital toplulukla ruh sağlığı farkındalığını artırmaya yönelik çalışmalar yürütüyorum.',
      },
    ],
    approach: {
      eyebrow: 'Yaklaşımım',
      title: 'Her insanın hikâyesi farklıdır. Bu yüzden terapi de öyle olmalıdır.',
      paragraphs: [
        'Terapiyi yalnızca konuşulan bir alan olarak görmüyorum. Benim için terapi; sizi zorlayan düşünce, duygu ve davranış döngülerini birlikte anlamaya ve değiştirmeye çalıştığımız aktif bir süreçtir.',
        'Bilişsel Davranışçı Terapi yaklaşımıyla çalışırken, sadece bugünkü zorlukları değil, bu zorlukların hayatınızı nasıl sürdürdüğünü de birlikte keşfederiz. Çünkü kalıcı değişim, yalnızca nedenleri anlamakla değil; yeni bakış açıları ve yeni davranışlar geliştirmekle mümkün olur.',
        'Seanslarımızda bazen sadece konuşuruz, bazen birlikte sorgularız, bazen de hayatın içinde uygulayabileceğiniz küçük ama etkili adımlar planlarız. Süreç, hazır hissettiğiniz hızda ve ihtiyaçlarınıza göre şekillenir.',
        'En önemlisi ise, bu odada hiçbir duygunuzu savunmak zorunda kalmazsınız. Kafa karışıklığınız, kararsızlığınız, kaygınız ya da çelişkileriniz… Hepsi birlikte çalışabileceğimiz sürecin doğal bir parçasıdır.',
      ],
    },
    portrait: media(PORTRAIT_ASSET),
    ctaBanner: ctaBanner(
      'Kendinizi anlamaya giden yol, bazen tek bir adımla başlar.',
      'İhtiyacınıza uygun bir görüşme planlamak için şimdi randevunuzu oluşturabilirsiniz.',
      'Randevu Al'
    ),
    seo: {
      _type: 'seo',
      metaTitle: 'Psikolog Sema Azab',
      metaDescription:
        'Danışanlarımla çalışmalarımı ağırlıklı olarak Bilişsel Davranışçı Terapi (BDT) yaklaşımı doğrultusunda yürütüyor, ihtiyaç duyulan durumlarda Şema Terapi bakış açısından da yararlanıyorum. Terapi sürecinde yalnızca yaşanan güçlükleri değil; bu güçlükleri sürdüren düşünce, duygu ve davranış örüntülerini birlikte anlamayı önemsiyorum. Amacım, danışanlarımın yaşadıkları zorlukları daha iyi anlamalarına ve yaşamlarında daha işlevsel değişimler oluşturabilmelerine bilimsel temellere dayanan bir yaklaşımla destek olmaktır.',
      ogImage: media(PORTRAIT_ASSET, 'Psikolog Sema Azab Hakkında'),
    },
  },
  {
    _id: 'servicesPage',
    _type: 'servicesPage',
    eyebrow: 'Odak Alanları',
    title: 'Yaşadığınız süreçte yanınızdayım',
    paragraph:
      'Her insanın hikâyesi farklıdır, bunlar sadece insanlara en sık başlangıç noktası olarak yardımcı olduğum alanlar.',
    howItWorks: {
      eyebrow: 'Terapi Süreci',
      title: 'İlk adımdan itibaren sizi neler bekliyor?',
      paragraph:
        'Terapiye başlamadan önce sürecin nasıl ilerlediğini bilmek, kendinizi daha güvende hissetmenizi sağlayabilir. İşte ilk görüşmeden itibaren sizi bekleyen adımlar.',
    },
    approachSteps: [
      {
        _key: 'step1',
        title: 'Başvuru',
        desc: 'İletişim formunu doldurduktan sonra en kısa sürede sizinle iletişime geçiyorum. Bu aşamada uygun gün ve saatleri birlikte belirleyerek seans randevunuzu planlıyoruz.',
      },
      {
        _key: 'step2',
        title: 'Randevu Planlaması',
        desc: 'Size uygun gün ve saat belirlendikten sonra seans bilgileriniz tarafınıza iletilir. Görüşmelerimiz WhatsApp görüntülü görüşme üzerinden online olarak gerçekleştirilmektedir.',
      },
      {
        _key: 'step3',
        title: 'İlk Seans',
        desc: 'İlk seansımız yaklaşık 50 dakika sürmektedir. Bu görüşmede sizi, yaşam öykünüzü ve şu anda destek almak istemenize neden olan süreci ayrıntılı olarak konuşuruz. Paylaştığınız bilgiler doğrultusunda ihtiyaçlarınızı birlikte değerlendirir ve terapi sürecine yönelik ilk yol haritamızı oluşturmaya başlarız.',
      },
      {
        _key: 'step4',
        title: 'Gizlilik',
        desc: 'Seanslarda paylaşılan tüm bilgiler etik ilkeler ve mesleki gizlilik kuralları çerçevesinde korunur. Güven duygusu, terapi sürecinin en önemli yapı taşlarından biridir.',
      },
      {
        _key: 'step5',
        title: 'Terapi Süreci',
        desc: 'Terapi sürecinin sıklığı ve süresi, ihtiyaçlarınıza göre birlikte planlanır. Görüşmeler genellikle haftada bir gerçekleştirilir. Süreç boyunca ilerlemeyi düzenli olarak birlikte değerlendiririz.',
      },
    ],
    ctaBanner: ctaBanner(
      'Kendinizi anlamaya giden yol, bazen tek bir adımla başlar.',
      'İhtiyacınıza uygun bir görüşme planlamak için şimdi randevunuzu oluşturabilirsiniz.',
      'Randevu Al'
    ),
    seo: {
      _type: 'seo',
      metaTitle: 'Hizmetler | Kaygı, Stres, İlişki ve Özgüven Terapisi',
      metaDescription:
        'Kaygı, stres, özgüven, ilişki, aşırı düşünme, erteleme ve duygu düzenleme konularında çevrimiçi bireysel terapi. Seansların nasıl işlediğini keşfedin.',
    },
  },
  {
    _id: 'contactPage',
    _type: 'contactPage',
    eyebrow: 'Bize Ulaşın',
    title: 'İlk adım, kendinize iyi gelmeye karar vermektir.',
    paragraph:
      'Aşağıdaki formu doldurarak seans talebinizi iletebilirsiniz. Talebinizi en kısa sürede değerlendirerek size uygun gün ve saat seçenekleriyle dönüş sağlayacağım. Görüşmeler çevrim içi olarak planlanmaktadır.',
    nextSteps: {
      heading: 'Sırada ne var?',
      steps: [
        'Formunuz incelendikten sonra en kısa sürede sizinle iletişime geçeceğim.',
        'Uygun gün ve saat seçenekleri birlikte belirlenecek ve seans randevunuz oluşturulacaktır.',
        'Randevu onaylandıktan sonra çevrim içi görüşme bağlantınız ve gerekli bilgilendirmeler sizinle paylaşılacaktır.',
      ],
    },
    assuranceBullets: [
      'Görüşmeler güvenli çevrim içi platform üzerinden gerçekleştirilir.',
      'Burada paylaştığınız her şey gizlidir ve yalnızca görüşmenizi ayarlamak için kullanılır.',
    ],
    successState: {
      heading: 'Teşekkür ederim.',
      paragraphs: [
        'Mesajınız alındı. Bir iş günü içinde sizinle iletişime geçeceğim.',
        'Rezervasyon onaylandığında size bilgi verilecektir. Şimdi lütfen bilgi formunu doldurunuz.',
      ],
      buttonLabel: 'Bilgi Formunu Doldur.',
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
      submitLabel: 'Randevu Al',
    },
    faqSection: {
      eyebrow: 'SSS',
      title: 'Sık sorulan sorular',
      paragraph: 'Terapi süreciyle ilgili en sık sorulan soruları burada bulabilirsiniz. Aradığınız cevabı burada bulamazsanız benimle iletişime geçebilirsiniz.',
    },
    faqs: [
      {
        _key: 'faq1',
        q: 'Seans ücreti ne kadar?',
        a: 'Bireysel çevrim içi seans ücreti 2.000 TL’dir.\nRandevu oluşturulduktan sonra ödeme sürecine ilişkin bilgiler sizinle paylaşılır. Seansın planlanabilmesi için ödemenin görüşme öncesinde tamamlanması beklenmektedir.',
      },
      {
        _key: 'faq2',
        q: 'Paylaştıklarım gizli kalır mı?',
        a: 'Evet. Seanslarda paylaştığınız tüm bilgiler, psikologların uymakla yükümlü olduğu etik ilkeler ve gizlilik kuralları kapsamında korunmaktadır. Gizlilik, terapi sürecinin temel yapı taşlarından biridir.',
      },
      {
        _key: 'faq3',
        q: 'Bir seans ne kadar sürer?',
        a: 'Her seans yaklaşık 50 dakika sürmektedir. Bu süre boyunca yalnızca yaşadığınız sorunları konuşmakla kalmayız; ihtiyaçlarınıza göre terapi sürecini birlikte planlar ve hedeflerimizi belirlemeye başlarız.',
      },
      {
        _key: 'faq4',
        q: 'Görüşmeler nasıl yapılıyor?',
        a: 'Tüm görüşmeler online olarak WhatsApp görüntülü görüşme üzerinden gerçekleştirilmektedir. Randevu gün ve saatinizde bağlantı kurarak seansımıza başlıyoruz.',
      },
      {
        _key: 'faq5',
        q: 'Kaç seans almam gerekir?',
        a: 'Bunun herkes için geçerli tek bir cevabı yoktur. Terapi süreci; başvuru nedeninize, ihtiyaçlarınıza, hedeflerinize ve süreçteki ilerlemenize göre değişiklik gösterebilir. İlk görüşmemizin ardından ihtiyaçlarınızı birlikte değerlendirir ve size uygun bir yol haritası oluşturarak süreci birlikte planlarız.',
      },
      {
        _key: 'faq6',
        q: 'İlk seansta neler konuşacağız?',
        a: 'İlk seans, terapi sürecinin en önemli adımlarından biridir. Bu görüşmede sizi tanımaya, yaşam öykünüzü, şu anda yaşadığınız güçlükleri ve terapiye dair beklentilerinizi anlamaya odaklanırım. Ancak ilk seans yalnızca sizi dinlediğim bir görüşme değildir. Paylaştığınız bilgiler doğrultusunda yaşadığınız süreci birlikte değerlendirir, ihtiyaçlarınızı belirler ve terapi sürecine yönelik ilk yol haritamızı oluşturmaya başlarız. Bu nedenle ilk seans, hem sizi tanımam hem de size en uygun şekilde destek olabilmem açısından oldukça kıymetlidir.',
      },
      {
        _key: '8e80fc463cd9',
        _type: 'faqItem',
        q: 'Seansımı iptal edebilir veya erteleyebilir miyim?',
        a: 'Randevu iptali veya değişikliği taleplerinizi en az 24 saat öncesinden bildirmenizi rica ederim. Acil sağlık sorunları veya beklenmeyen zorunlu durumlar gibi istisnai hâllerde birlikte yeni bir planlama yapılabilir. Bunun dışındaki son dakika iptallerinde seans ücreti iade edilmez.',
      },
      {
        _key: '2ae36cad7643',
        _type: 'faqItem',
        q: 'Terapiye başlamadan önce herhangi bir hazırlık yapmam gerekir mi?',
        a: 'Hayır. Terapiye başlamadan önce özel bir hazırlık yapmanız gerekmez. Kendinizi hazır hissetmeniz ve sürece açık olmanız yeterlidir. Gerekli gördüğümüz noktaları terapi süreci içerisinde birlikte ele alırız.',
      },
      {
        _key: '78a06bb171c1',
        _type: 'faqItem',
        q: 'Online terapi, yüz yüze terapi kadar etkili midir?',
        a: 'Evet. Bilimsel araştırmalar, uygun koşullar sağlandığında online terapinin birçok psikolojik konuda yüz yüze terapi kadar etkili olabileceğini göstermektedir. Terapi sürecinde belirleyici olan; kullanılan yöntemin bilimsel temellere dayanması, terapist ile danışan arasında kurulan güven ilişkisi ve sürecin düzenli şekilde devam etmesidir. Online terapi de bu koşullar sağlandığında etkili ve güvenilir bir destek sunmaktadır.',
      },
    ],
  },
  {
    _id: 'service-stress',
    _type: 'service',
    title: 'Stres ve Tükenmişlik',
    description: 'Günlük yaşamın yükü, iş, okul veya özel hayatınızdaki sorumluluklar sizi zihinsel ve duygusal olarak yoruyorsa, bu süreci birlikte değerlendirebiliriz.',
    icon: 'stress',
    tint: 'sage',
    topicValue: 'stress',
    order: 2,
  },
  {
    _id: 'service-grief',
    _type: 'service',
    title: 'Özgüven',
    description:
      'Kendinize dair eleştirel sesi yumuşatmak ve kendinize daha güvenle, daha az kuşkuyla yaklaşmayı öğrenmek için destek.',
    icon: 'self_confidence',
    tint: 'terracotta',
    topicValue: 'self_confidence',
    order: 3,
  },
  {
    _id: 'service-depression',
    _type: 'service',
    title: 'İlişki Problemleri',
    description:
      'İletişim örüntülerini anlamak ve hem kendinize hem karşınızdakine karşı daha sağlıklı sınırlar kurmak için birlikte çalışmak.',
    icon: 'relationships',
    tint: 'sage',
    topicValue: 'relationships',
    order: 4,
  },
  {
    // Kept under its original friendly _id, but its content was repurposed
    // in Studio from "Yaşam Geçişleri" to "Aşırı Düşünme" — the real
    // transitions service now lives at the UUID doc below.
    _id: 'service-transitions',
    _type: 'service',
    title: 'Aşırı Düşünme (Overthinking)',
    description:
      'Aynı düşünceler zihninizde sürekli dönüyor, olasılıkları tekrar tekrar düşünüyor ya da karar vermekte zorlanıyorsanız, bu düşünce döngülerini birlikte ele alabiliriz.',
    icon: 'overthinking',
    tint: 'terracotta',
    topicValue: 'overthinking',
    order: 5,
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
    order: 6,
  },
  {
    // Created directly in Studio (not via this seed script), so it kept the
    // UUID Sanity assigned instead of a friendly slug _id.
    _id: 'a6343270-eef7-4a73-a654-4349b27760f8',
    _type: 'service',
    title: 'Yaşam Geçişleri ve Uyum Süreci',
    description:
      'Mezuniyet, iş değişikliği, taşınma, ayrılık ya da hayatınızdaki önemli değişimlere uyum sağlamakta zorlanıyorsanız, bu süreci birlikte daha sağlıklı şekilde yönetebiliriz.',
    icon: 'transitions',
    tint: 'terracotta',
    topicValue: 'transitions',
    order: 7,
  },
  {
    // Created directly in Studio — see note on the doc above.
    _id: '2e933190-73a1-476e-a77b-e92ba0a3020a',
    _type: 'service',
    title: 'Duygu Düzenleme',
    description:
      'Yoğun öfke, üzüntü, suçluluk veya kaygı gibi duygularınızı anlamakta ve yönetmekte zorlanıyorsanız, duygularınızı daha sağlıklı şekilde düzenleyebilmeniz için birlikte çalışabiliriz.',
    icon: 'emotional_regulation',
    tint: 'sage',
    topicValue: 'emotional_regulation',
    order: 8,
  },
  {
    _id: 'service-procrastination',
    _type: 'service',
    title: 'Erteleme ve Mükemmeliyetçilik',
    description:
      'Bir işe başlamakta zorlanıyor, sürekli erteliyor ya da her şeyi kusursuz yapma isteği nedeniyle harekete geçemiyorsanız, bu döngüyü birlikte değiştirebiliriz.',
    icon: 'procrastination',
    tint: 'terracotta',
    topicValue: 'procrastination',
    order: 9,
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
