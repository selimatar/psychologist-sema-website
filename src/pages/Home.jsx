import { Link } from "react-router-dom";
import ServiceCard from "../components/ServiceCard.jsx";
import CtaBanner from "../components/CtaBanner.jsx";
import SanityImage from "../components/SanityImage.jsx";
import { useSanityQuery } from "../lib/useSanityQuery.js";
import { useDocumentSeo } from "../lib/useDocumentSeo.js";

const HOME_PAGE_QUERY = `*[_type == "homePage"][0]`;
const SERVICES_QUERY = `*[_type == "service"] | order(order asc)`;

export default function Home() {
  const { data: content } = useSanityQuery(HOME_PAGE_QUERY);
  const { data: services } = useSanityQuery(SERVICES_QUERY);

  useDocumentSeo(content?.seo);

  if (!content) return null;

  return (
    <>
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 pt-16 md:pt-20 pb-16 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div>
          <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
            {content.hero.eyebrow}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.15] font-medium text-ink mb-6">
            {content.hero.h1}
          </h1>
          <p className="text-lg text-[#5B5850] max-w-md mb-9">{content.hero.paragraph}</p>
          <div className="flex flex-wrap gap-4">
            <Link
              to={content.hero.primaryButtonPath || "/contact"}
              className="bg-terracotta text-white px-8 py-4 rounded-full text-base font-medium shadow-[0_4px_16px_rgba(201,123,92,0.28)] hover:opacity-90 transition-opacity"
            >
              {content.hero.primaryButtonLabel}
            </Link>
            <Link
              to={content.hero.secondaryButtonPath || "/services#how-it-works"}
              className="px-7 py-4 rounded-full text-base font-medium border border-charcoal/20 hover:border-charcoal/40 transition-colors"
            >
              {content.hero.secondaryButtonLabel}
            </Link>
          </div>
        </div>
        <div>
          <SanityImage
            image={content.hero.image}
            label="Yumuşak portre ya da sakinleştirici soyut görsel"
            className="w-full aspect-[4/5] rounded-[28px] shadow-[0_20px_50px_rgba(90,80,60,0.14)]"
          />
        </div>
      </section>

      {/* TRUST STRIP */}
      {(content.hero.trustStripItems ?? []).length > 0 && (
        <section className="max-w-4xl mx-auto px-6 md:px-8 pb-20">
          <div className="flex flex-wrap justify-center gap-x-9 gap-y-3 border-y border-charcoal/10 py-6">
            {content.hero.trustStripItems.map((item) => (
              <p key={item} className="m-0 text-[14.5px] text-[#5B5850]">
                {item}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* ABOUT TEASER */}
      <section className="bg-sand px-6 md:px-8 py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[0.7fr_1.3fr] gap-16 items-center">
          <SanityImage
            image={content.aboutTeaser.image}
            label="Terapi portresi"
            className="w-full max-w-[300px] aspect-square rounded-2xl shadow-[0_16px_40px_rgba(90,80,60,0.12)]"
          />
          <div>
            <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
              {content.aboutTeaser.eyebrow}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink mb-4">
              {content.aboutTeaser.h2}
            </h2>
            <p className="text-lg text-body max-w-xl mb-5">{content.aboutTeaser.paragraph}</p>
            <Link to="/about" className="text-[15.5px] font-semibold text-terracotta">
              {content.aboutTeaser.linkText} &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES TEASER */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 py-24">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
            {content.servicesTeaser.eyebrow}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-ink mb-3">
            {content.servicesTeaser.h2}
          </h2>
          <p className="text-lg text-[#5B5850] m-0">{content.servicesTeaser.paragraph}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(services ?? []).map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/services" className="text-[15.5px] font-semibold text-terracotta">
            {content.servicesTeaser.linkText} &rarr;
          </Link>
        </div>
      </section>

      {/* REASSURANCE QUOTE */}
      <section className="bg-sage-light px-6 md:px-8 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-serif italic text-2xl md:text-3xl leading-relaxed text-ink mb-5">
            &quot;{content.testimonial.quote}&quot;
          </p>
          <p className="m-0 text-sm text-sage-dark font-semibold">&mdash; {content.testimonial.attribution}</p>
        </div>
      </section>

      {/* FAQ TEASER */}
      <section className="max-w-3xl mx-auto px-6 md:px-8 py-24 text-center">
        <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
          {content.faqTeaser.eyebrow}
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink mb-4">
          {content.faqTeaser.h2}
        </h2>
        <p className="text-lg text-[#5B5850] mb-7">{content.faqTeaser.paragraph}</p>
        <Link
          to="/contact#faq"
          className="inline-block px-7 py-3.5 rounded-full text-[15.5px] font-medium border border-charcoal/20"
        >
          {content.faqTeaser.linkText} &rarr;
        </Link>
      </section>

      <CtaBanner
        title={content.ctaBanner.title}
        subtitle={content.ctaBanner.subtitle}
        buttonLabel={content.ctaBanner.buttonLabel}
      />
    </>
  );
}
