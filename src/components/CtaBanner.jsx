import { Link } from "react-router-dom";

// Reused on every page as the dark closing CTA block from the prototype
export default function CtaBanner({ title, subtitle, buttonLabel, to = "/contact" }) {
  return (
    <section className="px-6 md:px-8 pb-16 pt-8">
      <div className="max-w-4xl mx-auto rounded-xl2 px-8 md:px-12 py-14 text-center bg-cta-banner">
        <h2 className="font-serif text-2xl md:text-3xl font-medium text-cream mb-3">{title}</h2>
        <p className="text-[16px] text-[#C9C6BC] mb-6 max-w-md mx-auto">{subtitle}</p>
        <Link
          to={to}
          className="inline-block bg-terracotta text-white px-8 py-3.5 rounded-full text-[15.5px] font-medium hover:opacity-90 transition-opacity"
        >
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
}
