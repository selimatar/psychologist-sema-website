import { useState } from "react";
import FaqItem from "../components/FaqItem.jsx";
import { faqs } from "../data/content.tr.js";

// Contact doubles as the booking request form — see the scope note above.
// Fields cover both "reach out" (Contact) and "request consultation" (Booking)
// use cases from the prototype without needing two separate forms.
export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // No backend yet — this just flips the confirmation state.
    // Wire this up to your API/email service when the backend is ready.
    setSubmitted(true);
  }

  return (
    <>
      <section className="bg-sand px-6 md:px-8 pt-20 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
          <div>
            <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
              Bize Ulaşın
            </p>
            <h1 className="font-serif text-3xl md:text-5xl font-medium text-ink mb-5">
              İletişime geçmek çoğu zaman en zor kısımdır
            </h1>
            <p className="text-lg text-body mb-7">
              Aşağıya kısa bir not bırakın; bir iş günü içinde ücretsiz 15 dakikalık görüşme için
              size dönüş yapacağım — herhangi bir taahhüt yok, sadece bunun doğru hissettirmesi
              için bir fırsat.
            </p>
            <div className="flex flex-col gap-4">
              {[
                "Yalnızca güvenli video görüşmesi üzerinden çevrimiçi seanslar.",
                "Burada paylaştığınız her şey gizlidir ve yalnızca görüşmenizi ayarlamak için kullanılır.",
                "Özel ödeme uygulaması; ağ dışı geri ödeme için superbill sağlanır.",
              ].map((line) => (
                <div key={line} className="flex gap-3 items-start">
                  <span className="w-2 h-2 rounded-full bg-sage-light mt-2 flex-none" />
                  <p className="m-0 text-[15px] text-[#5B5850]">{line}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            {submitted ? (
              <div className="bg-white rounded-2xl p-11 text-center border border-charcoal/10">
                <p className="text-4xl mb-3">&#10003;</p>
                <h3 className="font-serif text-xl mb-2 text-ink">Talebiniz alındı</h3>
                <p className="text-[15.5px] text-[#5B5850] m-0 max-w-xs mx-auto">
                  İletişime geçtiğiniz için teşekkür ederim. Bir iş günü içinde ücretsiz görüşme
                  için sizinle iletişime geçeceğim.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl p-8 flex flex-col gap-5 border border-charcoal/10"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Adınız">
                    <input
                      type="text"
                      required
                      placeholder="Adınız"
                      className="input-field"
                    />
                  </Field>
                  <Field label="E-posta">
                    <input
                      type="email"
                      required
                      placeholder="ornek@mail.com"
                      className="input-field"
                    />
                  </Field>
                </div>

                <Field label="Ne konuda destek almak istersiniz?" optional>
                  <select className="input-field" defaultValue="">
                    <option value="">Bir alan seçin (isteğe bağlı)</option>
                    <option value="anxiety">Kaygı</option>
                    <option value="stress">Stres yönetimi</option>
                    <option value="transitions">Yaşam geçişleri</option>
                    <option value="grief">Yas</option>
                    <option value="depression">Depresyon</option>
                    <option value="trauma">Travma</option>
                    <option value="unsure">Henüz emin değilim</option>
                  </select>
                </Field>

                <Field label="Size en iyi hangi saatlerde ulaşayım?" optional>
                  <input
                    type="text"
                    placeholder="ör. hafta içi sabahları"
                    className="input-field"
                  />
                </Field>

                <Field label="Bilmemi istediğiniz bir şey var mı?" optional>
                  <textarea
                    rows={4}
                    placeholder="İsterseniz çok az ya da çok fazla paylaşabilirsiniz"
                    className="input-field resize-y"
                  />
                </Field>

                <button
                  type="submit"
                  className="mt-1 bg-terracotta text-white py-4 rounded-full text-base font-medium hover:opacity-90 transition-opacity"
                >
                  Ücretsiz Görüşme Talep Et
                </button>
                <p className="m-0 text-[13px] text-muted text-center">
                  Ödeme gerekmez. Bu, baskısız bir ilk adımdır.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ — id targeted by the /contact#faq links elsewhere in the app */}
      <section id="faq" className="max-w-3xl mx-auto px-6 md:px-8 py-24 scroll-mt-24">
        <div className="text-center mb-12">
          <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">SSS</p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-ink m-0">
            Sık sorulan sorular
          </h2>
        </div>
        <div className="flex flex-col gap-3.5">
          {faqs.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </div>
      </section>
    </>
  );
}

// Small local helper — not reused elsewhere, so kept in this file rather
// than promoted to /components.
function Field({ label, optional, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-charcoal mb-2">
        {label}
        {optional && <span className="text-muted font-normal"> (isteğe bağlı)</span>}
      </label>
      {children}
    </div>
  );
}