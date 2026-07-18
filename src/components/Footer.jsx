import {Link} from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-sand border-t border-charcoal/10 px-6 md:px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 md:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]">
          <div>
            <p className="font-serif text-lg font-semibold text-charcoal mb-3">Psk. Sema Azab</p>
            <p className="text-sm font-medium text-sage mb-2">Lisanslı Klinik Psikolog</p>
            <p className="text-sm text-body max-w-xs">
              Kaygı, stres ve yaşamın zorlu geçişleri için çevrimiçi psikoterapi.
            </p>
          </div>

          <div>
            <p className="text-[13px] uppercase tracking-[0.06em] text-muted font-semibold mb-4">
              Keşfet
            </p>
            <div className="flex flex-col gap-2.5">
              <Link to="/" className="text-[14.5px] text-charcoal hover:text-terracotta transition-colors">
                Ana Sayfa
              </Link>
              <Link to="/about" className="text-[14.5px] text-charcoal hover:text-terracotta transition-colors">
                Hakkımda
              </Link>
              <Link to="/services" className="text-[14.5px] text-charcoal hover:text-terracotta transition-colors">
                Hizmetler
              </Link>
              <Link to="/contact#faq" className="text-[14.5px] text-charcoal hover:text-terracotta transition-colors">
                SSS
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[13px] uppercase tracking-[0.06em] text-muted font-semibold mb-4">
              Başlayın
            </p>
            <div className="flex flex-col gap-2.5">
              <Link to="/contact" className="text-[14.5px] text-charcoal hover:text-terracotta transition-colors">
                İletişime Geçin
              </Link>
              <Link to="/contact" className="text-[14.5px] text-charcoal hover:text-terracotta transition-colors">
                Ücretsiz Görüşme Talep Edin
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[13px] uppercase tracking-[0.06em] text-muted font-semibold mb-4">
              Uygulama Bilgileri
            </p>
            <div className="flex flex-col gap-2.5">
              <p className="m-0 text-[14.5px] text-charcoal">Sadece çevrimiçi seanslar</p>
              <p className="m-0 text-[14.5px] text-charcoal">Özel ödeme, fatura (superbill) sağlanır</p>
              <p className="m-0 text-[14.5px] text-charcoal">Doktora, Klinik Psikoloji</p>
            </div>
          </div>
        </div>

        <div className="border-t border-charcoal/10 mt-10 pt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-[13.5px] text-muted m-0">
            &copy; {new Date().getFullYear()} Psk. Sema Azab, Psikoloji Muayenehanesi
          </p>
          <p className="text-[13px] text-muted m-0">
            Bir kriz yaşıyorsanız, lütfen 112&apos;i veya bulunduğunuz bölgedeki acil yardım hattını arayın.
          </p>
        </div>
      </div>
    </footer>
  );
}