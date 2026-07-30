import ImagePlaceholder from "./ImagePlaceholder.jsx";
import { urlFor } from "../lib/sanityImage.js";

// Renders the real Sanity image once uploaded; falls back to the existing
// placeholder box until then (all image fields are unset in the seed data).
export default function SanityImage({ image, label, className = "", width = 1200 }) {
  if (!image?.asset) {
    return <ImagePlaceholder label={label} className={className} />;
  }

  return (
    <img
      src={urlFor(image).width(width).fit("max").auto("format").url()}
      alt={label || ""}
      className={`object-cover ${className}`}
    />
  );
}
