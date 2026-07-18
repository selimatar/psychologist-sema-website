import { Link } from "react-router-dom";
import ImagePlaceholder from "../components/ImagePlaceholder.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import CtaBanner from "../components/CtaBanner.jsx";
import { services } from "../data/content.tr.js";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 pt-16 md:pt-20 pb-16 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div>
          <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
            Çevrimiçi Psikoterapi
          </p>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.15] font-medium text-ink mb-6">
            Şu anda sizi ağırlaştıran şeylerle başa çıkmak için daha sakin bir alan
          </h1>
          <p className="text-lg text-[#5B5850] max-w-md mb-9">
            Kaygı, stres ve yaşamın zorlu geçişleri için bireysel terapi — kendi hızınızda,
            çevrimiçi olarak sunulan istikrarlı ve kanıta dayalı destek.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="bg-terracotta text-white px-8 py-4 rounded-full text-base font-medium shadow-[0_4px_16px_rgba(201,123,92,0.28)] hover:opacity-90 transition-opacity"
            >
              Ücretsiz Görüşme Al
            </Link>
            <Link
              to="/services"
              className="px-7 py-4 rounded-full text-base font-medium border border-charcoal/20 hover:border-charcoal/40 transition-colors"
            >
              Seansların nasıl işlediğini gör
            </Link>
          </div>
        </div>
        <div>
          <ImagePlaceholder
            label="Yumuşak portre ya da sakinleştirici soyut görsel"
            className="w-full aspect-[4/5] rounded-[28px] shadow-[0_20px_50px_rgba(90,80,60,0.14)]"
          />
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="max-w-4xl mx-auto px-6 md:px-8 pb-20">
        <div className="flex flex-wrap justify-center gap-x-9 gap-y-3 border-y border-charcoal/10 py-6">
          {[
            "Lisanslı Klinik Psikolog",
            "12+ Yıllık Deneyim",
            "Gizli ve Güvenli Seanslar",
            "Çevrimiçi, Eyaletin Her Yerinden",
          ].map((item) => (
            <p key={item} className="m-0 text-[14.5px] text-[#5B5850]">
              {item}
            </p>
          ))}
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="bg-sand px-6 md:px-8 py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[0.7fr_1.3fr] gap-16 items-center">
          <ImagePlaceholder
            label="Terapi portresi"
            className="w-full max-w-[300px] aspect-square rounded-2xl shadow-[0_16px_40px_rgba(90,80,60,0.12)]"
          />
          <div>
            <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
              Hakkımda
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink mb-4">
              Masanın karşısında değil, yanınızda duran bir destek
            </h2>
            <p className="text-lg text-body max-w-xl mb-5">
              Bu pratiği kurmaya başladım çünkü terapiyi daha çok klinik bir engel gibi değil,
              gerçekten arkanızda duran biriyle yapılan bir konuşma gibi hissettirmek istedim.
              Yaklaşımım bilişsel-davranışçı ve psikodinamik eğitimimi gerçek bir sabırla
              birleştirir; başladığınız yer ne olursa olsun, ona uygun bir şekilde ilerler.
            </p>
            <Link to="/about" className="text-[15.5px] font-semibold text-terracotta">
              Arka planım ve yaklaşımım hakkında daha fazlasını oku &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES TEASER */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 py-24">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
            Odak Alanları
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-ink mb-3">
            Geçtiğiniz süreçte size destek olurum
          </h2>
          <p className="text-lg text-[#5B5850] m-0">
            Her insanın hikayesi farklıdır; bunlar en sık başladığımız alanlar.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/services" className="text-[15.5px] font-semibold text-terracotta">
            Tüm odak alanlarını ve seansların nasıl işlediğini gör &rarr;
          </Link>
        </div>
      </section>

      {/* REASSURANCE QUOTE */}
      <section className="bg-sage-light px-6 md:px-8 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-serif italic text-2xl md:text-3xl leading-relaxed text-ink mb-5">
            &quot;Doğru kelimeleri bulmak zorunda değilsin; hatta neyin yanlış olduğunu da bilmek zorunda değilsin. Sadece olduğun gibi görünmen yeterli — gerisini birlikte çözeriz.&quot;
          </p>
          <p className="m-0 text-sm text-sage-dark font-semibold">&mdash; Psk. Sema Azab</p>
        </div>
      </section>

      {/* FAQ TEASER */}
      <section className="max-w-3xl mx-auto px-6 md:px-8 py-24 text-center">
        <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
          Logistik mi merak ediyorsunuz?
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink mb-4">
          Ücretler, gizlilik ve seansların nasıl işlediği
        </h2>
        <p className="text-lg text-[#5B5850] mb-7">
          İlk seansınızdan önce insanların en sık sorduğu sorular — açık ve net cevaplarla.
        </p>
        <Link
          to="/contact#faq"
          className="inline-block px-7 py-3.5 rounded-full text-[15.5px] font-medium border border-charcoal/20"
        >
          SSS&apos;yi görüntüle &rarr;
        </Link>
      </section>

      <CtaBanner
        title="İletişime geçmek çoğu zaman en zor kısımdır"
        subtitle="Ücretsiz 15 dakikalık bir görüşme, bunun doğru bir adım olup olmadığını görmek için düşük baskılı bir yol sağlar — herhangi bir taahhüt yok."
        buttonLabel="Ücretsiz Görüşme Al"
      />
    </>
  );
}