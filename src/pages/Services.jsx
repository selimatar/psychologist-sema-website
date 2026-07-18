import ServiceCard from "../components/ServiceCard.jsx";
import CtaBanner from "../components/CtaBanner.jsx";
import { services, approachSteps } from "../data/content.js";

export default function Services() {
  return (
    <>
      <section className="max-w-6xl mx-auto px-6 md:px-8 pt-20 pb-10 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
            Areas of Focus
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-medium text-ink mb-3">
            Support for what you're navigating
          </h1>
          <p className="text-lg text-[#5B5850] m-0">
            Every person's story is different — these are simply the places I most often help
            people begin.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-8 pt-4 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </div>
      </section>

      <section className="bg-sage-light px-6 md:px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-sm tracking-wide uppercase text-sage-dark font-semibold mb-4">
              Approach
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-ink mb-3">
              What to expect, from the very first step
            </h2>
            <p className="text-lg text-[#33452E] m-0">
              Not knowing what therapy involves can be its own source of anxiety. Here's exactly
              how we'd work together.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {approachSteps.map((step) => (
              <div key={step.num} className="bg-cream rounded-2xl p-7">
                <p className="font-serif text-2xl text-terracotta font-semibold mb-3">
                  {step.num}
                </p>
                <h3 className="text-[17.5px] font-semibold text-ink mb-2">{step.title}</h3>
                <p className="text-[15px] text-[#5B5850] m-0">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Not sure which area fits your situation?"
        subtitle="That's exactly what the free consultation call is for."
        buttonLabel="Book a Free Consultation"
      />
    </>
  );
}