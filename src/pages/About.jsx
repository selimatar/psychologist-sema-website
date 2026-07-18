import ImagePlaceholder from "../components/ImagePlaceholder.jsx";
import CtaBanner from "../components/CtaBanner.jsx";

export default function About() {
  return (
    <>
      <section className="bg-sand px-6 md:px-8 pt-20 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-16 items-center">
          <ImagePlaceholder
            label="Terapi portresi"
            className="w-full max-w-[340px] aspect-square rounded-2xl shadow-[0_16px_40px_rgba(90,80,60,0.12)]"
          />
          <div>
            <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
              Hakkımda
            </p>
            <h1 className="font-serif text-3xl md:text-5xl font-medium text-ink mb-2">
              Psk. Sema Azab
            </h1>
            <p className="text-[15.5px] text-sage font-medium mb-6">
              Lisanslı Klinik Psikolog &middot; 12+ yıllık deneyim
            </p>
            <p className="text-lg text-body mb-5">
              Bu muayenehaneyi, terapinin klinik bir engelden çok, yanınızda olan biriyle yapılan bir
              sohbet gibi hissettirmesini istediğim için kurdum. Eğitimim bilişsel-davranışçı ve
              psikodinamik yaklaşımlar üzerine olsa da, her seansa rehberlik eden şey daha basit:
              merak, sabır ve taşıdıklarınıza gerçek bir saygı.
            </p>
            <p className="text-lg text-body mb-7">
              Seanslar dışında kaygı tedavisi üzerine yazıyor ve danışmanlık veriyorum, travma
              bilinçli bakım konusunda eğitimlerime devam ediyorum. Klinik Psikoloji alanında
              doktora derecesine sahibim ve çevrimiçi olarak ülke genelinde uygulama yapmaya
              yetkiliyim.
            </p>
            <div className="flex flex-wrap gap-7">
              {[
                ["Eğitim", "Doktora, Klinik Psikoloji"],
                ["Lisans", "Lisanslı Psikolog"],
                ["Format", "Sadece çevrimiçi seanslar"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="m-0 text-[13px] text-muted">{label}</p>
                  <p className="mt-0.5 mb-0 text-[15px] font-medium text-charcoal">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 md:px-8 py-24">
        <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
          Yaklaşımım
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink mb-5">
          Bulunduğunuz yerde sizinle buluşan bir terapi
        </h2>
        <p className="text-lg text-body mb-5">
          Herkese uyan tek bir yaklaşıma inanmıyorum. Kimi insanlar seanslar arasında
          uygulayabilecekleri yapılandırılmış araçlar ister; kimileri ise her şeyden önce sadece
          dinlenmeye ihtiyaç duyar. Birlikte yürüteceğimiz çalışma, sizin ihtiyacınıza göre
          şekillenecek — sizin öncülüğünüzü takip ederken, tıkandığınız noktalardan çıkmanıza
          yardımcı olacak klinik zemini de sunuyorum.
        </p>
        <p className="text-lg text-body m-0">
          Her şeyden önce, seanslarımızın iyi olduğunuzu göstermek zorunda olmadığınız bir alan
          olmasını istiyorum. Getirdiğiniz her şey — dağınıklık, belirsizlik, çelişkiler — kabul
          görür.
        </p>
      </section>

      <CtaBanner
        title="Birbirimize uygun olup olmadığımızı merak mı ediyorsunuz?"
        subtitle="Ücretsiz 15 dakikalık görüşme, bunu öğrenmenin en kolay yolu."
        buttonLabel="Ücretsiz Görüşme Talep Et"
      />
    </>
  );
}