import ServiceCard from "../components/ServiceCard.jsx";
import CtaBanner from "../components/CtaBanner.jsx";
import { useSanityQuery } from "../lib/useSanityQuery.js";

const SERVICES_PAGE_QUERY = `*[_type == "servicesPage"][0]`;
const SERVICES_QUERY = `*[_type == "service"] | order(order asc)`;

export default function Services() {
  const { data: content } = useSanityQuery(SERVICES_PAGE_QUERY);
  const { data: services } = useSanityQuery(SERVICES_QUERY);

  if (!content) return null;

  const steps = content.approachSteps ?? [];

  return (
    <>
      <section className="max-w-6xl mx-auto px-6 md:px-8 pt-20 pb-10 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
            {content.eyebrow}
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-medium text-ink mb-3">
            {content.title}
          </h1>
          <p className="text-lg text-[#5B5850] m-0">{content.paragraph}</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-8 pt-4 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(services ?? []).map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </div>
      </section>

      <section className="bg-sage-light/10 px-6 py-[88px]">
        <div className="max-w-[820px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm tracking-wide uppercase text-muted font-semibold mb-3.5">
              {content.howItWorks?.eyebrow}
            </p>
            <h2 className="font-serif text-3xl font-semibold text-ink m-0">
              {content.howItWorks?.title}
            </h2>
          </div>
          <div className="flex flex-col">
            {steps.map((step, i) => (
              <div key={step.title} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-sage-light text-cream font-serif font-semibold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-sage-light/35 min-h-8" />
                  )}
                </div>
                <div className="pb-10">
                  <h3 className="font-serif text-lg font-semibold text-ink mt-1.5 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-base text-body leading-relaxed max-w-[520px] m-0">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title={content.ctaBanner?.title}
        subtitle={content.ctaBanner?.subtitle}
        buttonLabel={content.ctaBanner?.buttonLabel}
      />
    </>
  );
}
