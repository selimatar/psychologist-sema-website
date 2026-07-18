export default function ServiceCard({ title, desc, tint }) {
  return (
    <div className="bg-white rounded-2xl p-7 border border-charcoal/[0.07]">
      <div className={`w-11 h-11 rounded-xl mb-5 ${tint}`} />
      <h3 className="font-serif text-xl font-semibold mb-2 text-ink">{title}</h3>
      <p className="text-[15.5px] text-[#5B5850] m-0">{desc}</p>
    </div>
  );
}