import { Link } from "react-router-dom";
import ImagePlaceholder from "../components/ImagePlaceholder.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import CtaBanner from "../components/CtaBanner.jsx";
import { services } from "../data/content.js";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 pt-16 md:pt-20 pb-16 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div>
          <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
            Online Psychotherapy
          </p>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.15] font-medium text-ink mb-6">
            A quieter place to work through what feels heavy right now
          </h1>
          <p className="text-lg text-[#5B5850] max-w-md mb-9">
            Individual therapy for anxiety, stress, and life's harder transitions — steady,
            evidence-based support delivered online, at your own pace.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="bg-terracotta text-white px-8 py-4 rounded-full text-base font-medium shadow-[0_4px_16px_rgba(201,123,92,0.28)] hover:opacity-90 transition-opacity"
            >
              Book a Free Consultation
            </Link>
            <Link
              to="/services"
              className="px-7 py-4 rounded-full text-base font-medium border border-charcoal/20 hover:border-charcoal/40 transition-colors"
            >
              How sessions work
            </Link>
          </div>
        </div>
        <div>
          <ImagePlaceholder
            label="Soft portrait or calming abstract image"
            className="w-full aspect-[4/5] rounded-[28px] shadow-[0_20px_50px_rgba(90,80,60,0.14)]"
          />
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="max-w-4xl mx-auto px-6 md:px-8 pb-20">
        <div className="flex flex-wrap justify-center gap-x-9 gap-y-3 border-y border-charcoal/10 py-6">
          {[
            "Licensed Clinical Psychologist",
            "12+ Years in Practice",
            "Confidential & Secure Sessions",
            "Online, From Anywhere in the State",
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
            label="Therapist portrait"
            className="w-full max-w-[300px] aspect-square rounded-2xl shadow-[0_16px_40px_rgba(90,80,60,0.12)]"
          />
          <div>
            <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
              About Psk. Azab
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink mb-4">
              Someone in your corner, not across a desk
            </h2>
            <p className="text-lg text-body max-w-xl mb-5">
              I started this practice because I wanted therapy to feel less like a clinical
              hurdle and more like a conversation with someone who genuinely has your back. My
              approach blends cognitive-behavioral and psychodynamic training with real patience
              for wherever you're starting from.
            </p>
            <Link to="/about" className="text-[15.5px] font-semibold text-terracotta">
              Read more about my background &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES TEASER */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 py-24">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
            Areas of Focus
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-ink mb-3">
            Support for what you're navigating
          </h2>
          <p className="text-lg text-[#5B5850] m-0">
            Every person's story is different — these are simply the places I most often help
            people begin.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/services" className="text-[15.5px] font-semibold text-terracotta">
            See all areas of focus &amp; how sessions work &rarr;
          </Link>
        </div>
      </section>

      {/* REASSURANCE QUOTE */}
      <section className="bg-sage-light px-6 md:px-8 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-serif italic text-2xl md:text-3xl leading-relaxed text-ink mb-5">
            "You don't need to have the right words, or even know what's wrong. You just need to
            show up as you are — we'll figure out the rest together."
          </p>
          <p className="m-0 text-sm text-sage-dark font-semibold">&mdash; Psk. Sema Azab</p>
        </div>
      </section>

      {/* FAQ TEASER */}
      <section className="max-w-3xl mx-auto px-6 md:px-8 py-24 text-center">
        <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
          Wondering About Logistics?
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink mb-4">
          Pricing, confidentiality, and how sessions work
        </h2>
        <p className="text-lg text-[#5B5850] mb-7">
          Common questions people ask before their first session — answered plainly.
        </p>
        <Link
          to="/contact#faq"
          className="inline-block px-7 py-3.5 rounded-full text-[15.5px] font-medium border border-charcoal/20"
        >
          Visit the FAQ &rarr;
        </Link>
      </section>

      <CtaBanner
        title="Reaching out is often the hardest part"
        subtitle="A free 15-minute consultation call is a low-pressure way to see if this feels right — no commitment required."
        buttonLabel="Book a Free Consultation"
      />
    </>
  );
}