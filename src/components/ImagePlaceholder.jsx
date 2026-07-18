// Stand-in for the prototype's <image-slot> web component.
// Swap the children/background with a real <img> once photography is ready.
export default function ImagePlaceholder({ label = "Image", className = "" }) {
  return (
    <div
      className={`flex items-center justify-center bg-[#EAE3D6] text-muted text-sm font-medium select-none ${className}`}
    >
      {label}
    </div>
  );
}