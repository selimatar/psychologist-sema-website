const iconStroke = {
  anxiety: "#6E8F63",
  stress: "#B57A54",
  transitions: "#6E8F63",
  grief: "#B57A54",
  depression: "#6E8F63",
  trauma: "#B57A54",
};

function renderIcon(name) {
  const stroke = iconStroke[name] ?? "#5C6B52";

  switch (name) {
    case "anxiety":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
        </svg>
      );
    case "stress":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v3" />
          <path d="M12 18v3" />
          <path d="M4.9 4.9l2.1 2.1" />
          <path d="M17 17l2.1 2.1" />
          <path d="M3 12h3" />
          <path d="M18 12h3" />
          <path d="M4.9 19.1l2.1-2.1" />
          <path d="M17 7l2.1-2.1" />
        </svg>
      );
    case "transitions":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 17l5-11 5 11" />
          <path d="M13 17l4-7 4 7" />
        </svg>
      );
    case "grief":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3c2.5 3 4 5.5 4 8a4 4 0 1 1-8 0c0-2.5 1.5-5 4-8z" />
        </svg>
      );
    case "depression":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="7" />
          <path d="M9 13c.7.9 1.8 1.4 3 1.4s2.3-.5 3-1.4" />
        </svg>
      );
    case "trauma":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l2 6 6 1-4.5 4.5L17 21l-5-3-5 3 1.5-6.5L4 10l6-1z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ServiceCard({ title, desc, tint, icon }) {
  return (
    <div className="bg-white rounded-2xl p-7 border border-charcoal/[0.07]">
      <div className={`w-11 h-11 rounded-xl mb-5 flex items-center justify-center ${tint}`}>
        {renderIcon(icon)}
      </div>
      <h3 className="font-serif text-xl font-semibold mb-2 text-ink">{title}</h3>
      <p className="text-[15.5px] text-[#5B5850] m-0">{desc}</p>
    </div>
  );
}
