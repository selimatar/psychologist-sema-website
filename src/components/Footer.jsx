import {Link} from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-sand border-t border-charcoal/10 px-6 md:px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 md:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]">
          <div>
            <p className="font-serif text-lg font-semibold text-charcoal mb-3">Dr. Sema Azap</p>
            <p className="text-sm font-medium text-sage mb-2">Licensed Clinical Psychologist</p>
            <p className="text-sm text-body max-w-xs">
              Online psychotherapy for anxiety, stress, and life&apos;s harder transitions.
            </p>
          </div>

          <div>
            <p className="text-[13px] uppercase tracking-[0.06em] text-muted font-semibold mb-4">
              Explore
            </p>
            <div className="flex flex-col gap-2.5">
              <Link to="/" className="text-[14.5px] text-charcoal hover:text-terracotta transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-[14.5px] text-charcoal hover:text-terracotta transition-colors">
                About
              </Link>
              <Link to="/services" className="text-[14.5px] text-charcoal hover:text-terracotta transition-colors">
                Services
              </Link>
              <Link to="/contact" className="text-[14.5px] text-charcoal hover:text-terracotta transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[13px] uppercase tracking-[0.06em] text-muted font-semibold mb-4">
              Get Started
            </p>
            <div className="flex flex-col gap-2.5">
              <Link to="/contact" className="text-[14.5px] text-charcoal hover:text-terracotta transition-colors">
                Contact
              </Link>
              <Link to="/contact" className="text-[14.5px] text-charcoal hover:text-terracotta transition-colors">
                Book a Consultation
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[13px] uppercase tracking-[0.06em] text-muted font-semibold mb-4">
              Practice Details
            </p>
            <div className="flex flex-col gap-2.5">
              <p className="m-0 text-[14.5px] text-charcoal">Online sessions only</p>
              <p className="m-0 text-[14.5px] text-charcoal">Private pay, superbill provided</p>
              <p className="m-0 text-[14.5px] text-charcoal">Ph.D., Clinical Psychology</p>
            </div>
          </div>
        </div>

        <div className="border-t border-charcoal/10 mt-10 pt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-[13.5px] text-muted m-0">
            &copy; {new Date().getFullYear()} Dr. Sema Azap, Psychology Practice
          </p>
          <p className="text-[13px] text-muted m-0">
            If you are in crisis, please call 988 (Suicide &amp; Crisis Lifeline) or your local
            emergency number.
          </p>
        </div>
      </div>
    </footer>
  );
}