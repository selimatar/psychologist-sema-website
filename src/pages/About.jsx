import CtaBanner from "../components/CtaBanner.jsx";
import SanityImage from "../components/SanityImage.jsx";
import { useSanityQuery } from "../lib/useSanityQuery.js";

const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0]`;

export default function About() {
  const { data: content } = useSanityQuery(ABOUT_PAGE_QUERY);

  if (!content) return null;

  const bioParagraphs = content.bioParagraphs ?? [];
  const approachParagraphs = content.approach?.paragraphs ?? [];

  return (
    <>
      <section className="bg-sand px-6 md:px-8 pt-20 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-16 items-center">
          <SanityImage
            image={content.portrait}
            label="Terapi portresi"
            className="w-full max-w-[340px] aspect-square rounded-2xl shadow-[0_16px_40px_rgba(90,80,60,0.12)]"
          />
          <div>
            <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
              {content.eyebrow}
            </p>
            <h1 className="font-serif text-3xl md:text-5xl font-medium text-ink mb-2">
              {content.title}
            </h1>
            <p className="text-[15.5px] text-sage font-medium mb-6">{content.credentialLine}</p>
            {bioParagraphs.map((p, i) => (
              <p
                key={p}
                className={`text-lg text-body ${i === bioParagraphs.length - 1 ? "mb-7" : "mb-5"}`}
              >
                {p}
              </p>
            ))}
            <div className="flex flex-wrap gap-7">
              {(content.credentials ?? []).map(({ label, value }) => (
                <div key={label}>
                  <p className="m-0 text-[13px] text-muted">{label}</p>
                  <p className="mt-0.5 mb-0 text-[15px] font-medium text-charcoal">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 md:px-8 py-24">
        <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
          {content.approach?.eyebrow}
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink mb-5">
          {content.approach?.title}
        </h2>
        {approachParagraphs.map((p, i) => (
          <p
            key={p}
            className={`text-lg text-body ${i === approachParagraphs.length - 1 ? "m-0" : "mb-5"}`}
          >
            {p}
          </p>
        ))}
      </section>

      <CtaBanner
        title={content.ctaBanner?.title}
        subtitle={content.ctaBanner?.subtitle}
        buttonLabel={content.ctaBanner?.buttonLabel}
      />
    </>
  );
}
