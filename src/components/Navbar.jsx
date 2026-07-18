import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";

const links = [
  { to: "/", label: "Ana Sayfa" },
  { to: "/about", label: "Hakkımda" },
  { to: "/services", label: "Hizmetler" },
  { to: "/contact", label: "İletişim" },
];

// Active-link styling helper — NavLink gives us isActive for free
const linkClasses = ({ isActive }) =>
  `text-[15px] transition-colors ${
    isActive ? "text-terracotta font-semibold" : "text-charcoal hover:text-terracotta"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const headerRef = useRef(null);

  // Reserve space for the fixed header by publishing its live height as a CSS var
  // that Layout uses for top padding — avoids content jumping under the navbar.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const setHeightVar = () => {
      document.documentElement.style.setProperty("--navbar-h", `${el.offsetHeight}px`);
    };

    setHeightVar();
    const observer = new ResizeObserver(setHeightVar);
    observer.observe(el);
    return () => observer.disconnect();
  }, [open]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show near the top, and never hide while the mobile menu is open
      if (currentScrollY < 80 || open) {
        setHidden(false);
      } else if (currentScrollY > lastScrollY.current) {
        setHidden(true); // scrolling down
      } else {
        setHidden(false); // scrolling up
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-charcoal/10 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between gap-6">
        <Link
          to="/"
          className="font-serif text-xl font-semibold text-charcoal tracking-tight"
          onClick={() => setOpen(false)}
        >
          Psk. Sema Azab
        </Link>

        {/* Desktop nav — hidden below md, hamburger takes over */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={linkClasses}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/contact"
          className="hidden md:inline-block bg-terracotta text-white px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_rgba(201,123,92,0.25)] hover:opacity-90 transition-opacity"
        >
          Randevu Al
        </Link>

        {/* Hamburger button — pure Tailwind, no icon library */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8"
          aria-label="Menüyü aç/kapat"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block h-0.5 w-6 bg-charcoal transition-transform ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-charcoal transition-opacity ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-charcoal transition-transform ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <nav className="md:hidden flex flex-col gap-1 px-6 pb-5 border-t border-charcoal/10 pt-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `py-2.5 text-[15px] ${
                  isActive ? "text-terracotta font-semibold" : "text-charcoal"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-3 bg-terracotta text-white text-center px-5 py-3 rounded-full text-sm font-medium"
          >
            Randevu Al
          </Link>
        </nav>
      )}
    </header>
  );
}