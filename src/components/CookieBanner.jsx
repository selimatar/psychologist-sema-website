import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 md:px-6 md:pb-6">
      <div className="max-w-3xl mx-auto rounded-xl2 bg-charcoal text-cream shadow-lg px-6 py-5 md:px-8 md:py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-[9px] leading-relaxed text-[#D8D5CB] m-0">
          Bu web sitesi, size daha iyi bir deneyim sunmak için gerekli çerezleri kullanır. Siteyi
          kullanmaya devam ederek çerez kullanımını kabul etmiş olursunuz.
        </p>
        <button
          type="button"
          onClick={handleAccept}
          className="shrink-0 bg-terracotta text-white px-6 py-2.5 rounded-full text-[9px] font-medium hover:opacity-80 transition-opacity"
        >
          Kabul Et
        </button>
      </div>
    </div>
  );
}
