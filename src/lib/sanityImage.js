import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "./sanityClient.js";

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source) {
  return builder.image(source);
}
