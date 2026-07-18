import ImagePlaceholder from "../components/ImagePlaceholder.jsx";
import CtaBanner from "../components/CtaBanner.jsx";

export default function About() {
  return (
    <>
      <section className="bg-sand px-6 md:px-8 pt-20 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-16 items-center">
          <ImagePlaceholder
            label="Therapist portrait"
            className="w-full max-w-[340px] aspect-square rounded-2xl shadow-[0_16px_40px_rgba(90,80,60,0.12)]"
          />
          <div>
            <p className="text-sm tracking-wide uppercase text-sage font-semibold mb-4">
              About
            </p>
            <h1 className="font-serif text-3xl md:text-5xl font-medium text-ink mb-2">
              Dr. Sema Azab, Ph.D.
            </h1>
            <p className="text-[15.5px] text-sage font-medium mb-6">
              Licensed Clinical Psychologist &middot; 12+ years in practice
            </p>
            <p className="text-lg text-body mb-5">
              I started this practice because I wanted therapy to feel less like a clinical
              hurdle and more like a conversation with someone in your corner. My training is in
              cognitive-behavioral and psychodynamic approaches, but what guides each session is
              simpler: curiosity, patience, and genuine respect for what you're carrying.
            </p>
            <p className="text-lg text-body mb-7">
              Outside of sessions, I write and consult on anxiety treatment and continue ongoing
              training in trauma-informed care. I hold a Ph.D. in Clinical Psychology and am
              licensed to practice online across the state.
            </p>
            <div className="flex flex-wrap gap-7">
              {[
                ["Education", "Ph.D., Clinical Psychology"],
                ["License", "Licensed Psychologist"],
                ["Format", "Online sessions only"],
              ].map(([label, value]) => (
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
          My Philosophy
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink mb-5">
          Therapy that meets you where you are
        </h2>
        <p className="text-lg text-body mb-5">
          I don't believe in a one-size-fits-all approach. Some people want structured tools they
          can practice between sessions; others need space to simply be heard before anything
          else. Our work together will look different depending on what you need — I follow your
          lead, while offering the clinical grounding to help you get unstuck.
        </p>
        <p className="text-lg text-body m-0">
          Above all, I want our sessions to be a place where you don't have to perform being
          okay. Whatever you bring in — mess, uncertainty, contradictions — is welcome.
        </p>
      </section>

      <CtaBanner
        title="Curious if we're a good fit?"
        subtitle="A free 15-minute consultation call is the easiest way to find out."
        buttonLabel="Book a Free Consultation"
      />
    </>
  );
}