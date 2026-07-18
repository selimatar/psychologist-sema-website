import { useState } from "react";
import FaqItem from "../components/FaqItem.jsx";
import { faqs } from "../data/content.js";

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
              Get in Touch
            </p>
            <h1 className="font-serif text-3xl md:text-5xl font-medium text-ink mb-5">
              Reaching out is often the hardest part
            </h1>
            <p className="text-lg text-body mb-7">
              Send a short note below and I'll reply within one business day to schedule a free
              15-minute consultation call — no commitment, just a chance to see if it feels
              right.
            </p>
            <div className="flex flex-col gap-4">
              {[
                "Online sessions only, via secure video call.",
                "Everything you share here is confidential and used only to arrange your consultation.",
                "Private-pay practice — a superbill is provided for out-of-network reimbursement.",
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
                <h3 className="font-serif text-xl mb-2 text-ink">Request received</h3>
                <p className="text-[15.5px] text-[#5B5850] m-0 max-w-xs mx-auto">
                  Thank you for reaching out. I'll email you within one business day to find a
                  time for your free consultation call.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl p-8 flex flex-col gap-5 border border-charcoal/10"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First name">
                    <input
                      type="text"
                      required
                      placeholder="Your first name"
                      className="input-field"
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="input-field"
                    />
                  </Field>
                </div>

                <Field label="What would you like support with?" optional>
                  <select className="input-field" defaultValue="">
                    <option value="">Select an area (optional)</option>
                    <option value="anxiety">Anxiety</option>
                    <option value="stress">Stress management</option>
                    <option value="transitions">Life transitions</option>
                    <option value="grief">Grief</option>
                    <option value="depression">Depression</option>
                    <option value="trauma">Trauma</option>
                    <option value="unsure">Not sure yet</option>
                  </select>
                </Field>

                <Field label="Best times to reach you" optional>
                  <input
                    type="text"
                    placeholder="e.g. weekday mornings"
                    className="input-field"
                  />
                </Field>

                <Field label="Anything you'd like me to know?" optional>
                  <textarea
                    rows={4}
                    placeholder="Share as much or as little as you'd like"
                    className="input-field resize-y"
                  />
                </Field>

                <button
                  type="submit"
                  className="mt-1 bg-terracotta text-white py-4 rounded-full text-base font-medium hover:opacity-90 transition-opacity"
                >
                  Request Free Consultation
                </button>
                <p className="m-0 text-[13px] text-muted text-center">
                  No payment required. This is a no-pressure first step.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ — id targeted by the /contact#faq links elsewhere in the app */}
      <section id="faq" className="max-w-3xl mx-auto px-6 md:px-8 py-24 scroll-mt-24">
        <div className="text-center mb-12">
          <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">FAQ</p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-ink m-0">
            Common questions
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
        {optional && <span className="text-muted font-normal"> (optional)</span>}
      </label>
      {children}
    </div>
  );
}