export default function Footer() {
  return (
    <footer className="px-6 md:px-8 py-10 border-t border-charcoal/10">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted m-0">
          &copy; {new Date().getFullYear()} Dr. Sema Azab, Psychology Practice
        </p>
        <p className="text-[13px] text-muted m-0">
          If you are in crisis, please call 988 (Suicide &amp; Crisis Lifeline) or your local
          emergency number.
        </p>
      </div>
    </footer>
  );
}