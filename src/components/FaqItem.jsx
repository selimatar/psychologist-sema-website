import { useState } from "react";

// Self-contained accordion item — each card owns its own open state,
// so there's no need to lift state up to the page for a simple FAQ list.
export default function FaqItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl border border-charcoal/[0.08] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <h3 className="text-[16.5px] font-semibold m-0 text-ink">{q}</h3>
        <span
          className={`text-2xl text-terracotta flex-none transition-transform ${
            open ? "rotate-45" : "rotate-0"
          }`}
        >
          +
        </span>
      </button>
      {open && <p className="m-0 px-6 pb-6 text-[15.5px] text-[#5B5850]">{a}</p>}
    </div>
  );
}