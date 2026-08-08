import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import FaqItem from "../components/FaqItem.jsx";
import SlotPicker from "../components/SlotPicker.jsx";
import { useSanityQuery } from "../lib/useSanityQuery.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
// Not Sanity content — this is the default booking-form URL used before the
// backend responds; the real one (data.googleFormUrl) overwrites it on submit.
const FALLBACK_GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdH0Wwbe097talQ6YToA1W7gVrRe0p1XKBaQfzihDebDjYx5g/viewform";

const CONTACT_PAGE_QUERY = `*[_type == "contactPage"][0]`;
const SERVICES_QUERY = `*[_type == "service"] | order(order asc)`;

// Fixed booking-topic taxonomy — mirrors server/src/validators/bookingRequest.validator.js's
// Zod TOPICS enum exactly. Only each option's display label is Sanity-sourced
// (via the matching `service` document's title); "unsure" has no service
// counterpart, so its label is the one piece of this dropdown that's never
// Sanity content and stays hardcoded.
const TOPIC_SLUGS = ["anxiety", "stress", "transitions", "grief", "depression", "trauma", "unsure"];
const UNSURE_TOPIC_LABEL = "Henüz emin değilim";

const emptyForm = { name: "", email: "", topic: "", notes: "" };

// Contact doubles as the booking request form — see the scope note above.
// Fields cover both "reach out" (Contact) and "request consultation" (Booking)
// use cases from the prototype without needing two separate forms.
export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [slotReloadToken, setSlotReloadToken] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [googleFormUrl, setGoogleFormUrl] = useState(FALLBACK_GOOGLE_FORM_URL);
  const [highlightSuccess, setHighlightSuccess] = useState(false);
  const successStateRef = useRef(null);

  const { data: content } = useSanityQuery(CONTACT_PAGE_QUERY);
  const { data: services } = useSanityQuery(SERVICES_QUERY);
  const location = useLocation();

  // React Router doesn't auto-scroll to a URL hash on client-side navigation
  // (only real page loads do), and the FAQ section only exists once `content`
  // has loaded, so scroll manually once it's actually in the DOM.
  useEffect(() => {
    if (!content || !location.hash) return;
    const el = document.querySelector(location.hash);
    el?.scrollIntoView({ behavior: "smooth" });
  }, [content, location.hash]);

  // After a successful submission, the confirmation box replaces the form —
  // easy to miss if the user was scrolled somewhere else on the page (e.g.
  // mobile, where the two columns stack). Pull it into view and pulse it
  // once so the success message and next-steps CTA actually get read.
  useEffect(() => {
    if (!submitted) return;
    successStateRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightSuccess(true);
    const timer = setTimeout(() => setHighlightSuccess(false), 2200);
    return () => clearTimeout(timer);
  }, [submitted]);

  if (!content) return null;

  const faqs = content.faqs ?? [];

  const topicLabels = { unsure: UNSURE_TOPIC_LABEL };
  for (const s of services ?? []) {
    if (s.topicValue) topicLabels[s.topicValue] = s.title;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");

    if (!selectedSlot) {
      setSubmitError("Lütfen uygun bir saat seçin.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/booking-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          topic: form.topic || undefined,
          notes: form.notes || undefined,
          slotStart: selectedSlot.start,
          slotEnd: selectedSlot.end,
        }),
      });

      if (res.status === 409) {
        setSubmitError("Seçtiğiniz saat az önce doldu. Lütfen başka bir saat seçin.");
        setSelectedSlot(null);
        setSlotReloadToken((t) => t + 1);
        return;
      }

      if (!res.ok) {
        setSubmitError("Talebiniz gönderilirken bir sorun oluştu. Lütfen tekrar deneyin.");
        return;
      }

      const data = await res.json();
      if (data.googleFormUrl) setGoogleFormUrl(data.googleFormUrl);
      setSubmitted(true);
    } catch {
      setSubmitError("Talebiniz gönderilirken bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="bg-sand px-6 md:px-8 pt-20 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-14 items-start">
          <div>
            <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
              {content.eyebrow}
            </p>
            <h1 className="font-serif text-3xl md:text-5xl font-medium text-ink mb-5">
              {content.title}
            </h1>
            <p className="text-lg text-body mb-7">{content.paragraph}</p>

            <div className="bg-sand rounded-2xl p-7 mb-5">
              <h3 className="font-serif text-lg font-semibold mb-4 text-ink">
                {content.nextSteps?.heading}
              </h3>
              <div className="flex flex-col gap-4">
                {(content.nextSteps?.steps ?? []).map((line, i) => (
                  <div key={line} className="flex gap-3">
                    <p className="m-0 font-serif font-semibold text-terracotta flex-none w-5">{i + 1}</p>
                    <p className="m-0 text-[15px] text-[#4E4B44]">{line}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {(content.assuranceBullets ?? []).map((line) => (
                <div key={line} className="flex gap-3 items-start">
                  <span className="w-2 h-2 rounded-full bg-sage-light mt-2 flex-none" />
                  <p className="m-0 text-[15px] text-[#5B5850]">{line}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            {submitted ? (
              <div
                ref={successStateRef}
                className={`bg-white rounded-2xl p-11 text-center border border-charcoal/10 scroll-mt-24 ring-terracotta transition-shadow duration-500 ${
                  highlightSuccess ? "ring-2 ring-offset-2 ring-offset-sand" : "ring-0"
                }`}
              >
                <p className="text-4xl mb-3">&#10003;</p>
                <h3 className="font-serif text-xl mb-2 text-ink">{content.successState?.heading}</h3>
                <p className="text-[15.5px] text-[#5B5850] m-0 max-w-xs mx-auto">
                  {content.successState?.paragraphs?.[0]}
                </p>
                <p className="text-[15.5px] text-[#5B5850] mt-4 mb-5 max-w-xs mx-auto">
                  {content.successState?.paragraphs?.[1]}
                </p>
                <a
                  href={googleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-terracotta text-white px-8 py-3.5 rounded-full text-[15.5px] font-medium hover:opacity-90 transition-opacity"
                >
                  {content.successState?.buttonLabel}
                </a>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl p-10 flex flex-col gap-6 border border-charcoal/10"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label={content.formLabels?.nameLabel}>
                    <input
                      type="text"
                      required
                      placeholder={content.formLabels?.nameLabel}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field"
                    />
                  </Field>
                  <Field label={content.formLabels?.emailLabel}>
                    <input
                      type="email"
                      required
                      placeholder={content.formLabels?.emailPlaceholder}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-field"
                    />
                  </Field>
                </div>

                <Field label={content.formLabels?.topicLabel} optional>
                  <select
                    className="input-field"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  >
                    <option value="">{content.formLabels?.topicPlaceholder}</option>
                    {TOPIC_SLUGS.map((slug) => (
                      <option key={slug} value={slug}>
                        {topicLabels[slug]}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label={content.formLabels?.slotLabel}>
                  <SlotPicker
                    selected={selectedSlot}
                    onSelect={setSelectedSlot}
                    reloadToken={slotReloadToken}
                  />
                </Field>

                <Field label={content.formLabels?.notesLabel} optional>
                  <textarea
                    rows={4}
                    placeholder={content.formLabels?.notesPlaceholder}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="input-field resize-y"
                  />
                </Field>

                {submitError && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 m-0">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-1 bg-terracotta text-white py-4 rounded-full text-base font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {submitting ? "Gönderiliyor..." : content.formLabels?.submitLabel}
                </button>
                <p className="m-0 text-[13px] text-muted text-center">{content.formLabels?.submitNote}</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ — id targeted by the /contact#faq links elsewhere in the app */}
      <section id="faq" className="max-w-3xl mx-auto px-6 md:px-8 py-24 scroll-mt-24">
        <div className="text-center mb-12">
          <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
            {content.faqSection?.eyebrow}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-ink m-0">
            {content.faqSection?.title}
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
