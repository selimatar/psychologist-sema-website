import { Link } from "react-router-dom";
import { useSanityQuery } from "../lib/useSanityQuery.js";

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]`;

export default function Footer() {
  const { data: settings } = useSanityQuery(SITE_SETTINGS_QUERY);

  const exploreLinks = settings?.footerExploreLinks ?? [];
  const startLinks = settings?.footerStartLinks ?? [];
  const infoLines = settings?.footerInfoLines ?? [];

  return (
    <footer className="bg-sand border-t border-charcoal/10 px-6 md:px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 md:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]">
          <div>
            <p className="font-serif text-lg font-semibold text-charcoal mb-3">
              {settings?.footerBrandTitle}
            </p>
            <p className="text-sm font-medium text-sage mb-2">{settings?.footerBrandSubtitle}</p>
            <p className="text-sm text-body max-w-xs">{settings?.footerTagline}</p>
          </div>

          <div>
            <p className="text-[13px] uppercase tracking-[0.06em] text-muted font-semibold mb-4">
              Keşfet
            </p>
            <div className="flex flex-col gap-2.5">
              {exploreLinks.map((l) => (
                <Link
                  key={l.path + l.label}
                  to={l.path}
                  className="text-[14.5px] text-charcoal hover:text-terracotta transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[13px] uppercase tracking-[0.06em] text-muted font-semibold mb-4">
              Başlayın
            </p>
            <div className="flex flex-col gap-2.5">
              {startLinks.map((l) => (
                <Link
                  key={l.path + l.label}
                  to={l.path}
                  className="text-[14.5px] text-charcoal hover:text-terracotta transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[13px] uppercase tracking-[0.06em] text-muted font-semibold mb-4">
              Uygulama Bilgileri
            </p>
            <div className="flex flex-col gap-2.5">
              {infoLines.map((line) => (
                <p key={line} className="m-0 text-[14.5px] text-charcoal">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-charcoal/10 mt-10 pt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-[13.5px] text-muted m-0">
            &copy; {new Date().getFullYear()} {settings?.copyrightBusinessName}
          </p>
          <p className="text-[13px] text-muted m-0">{settings?.crisisLineText}</p>
        </div>
      </div>
    </footer>
  );
}
