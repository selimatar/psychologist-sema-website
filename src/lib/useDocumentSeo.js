import { useEffect } from "react";
import { urlFor } from "./sanityImage.js";

// Mirrors the <title> already hardcoded in index.html — used whenever a page
// hasn't had its Sanity `seo.metaTitle` filled in yet, so navigating away
// from a page that does have one never leaves a stale title behind.
const DEFAULT_TITLE = "Psk. Sema AZAB — Çevrimiçi Psikoterapi";

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

// Applies a page's Sanity `seo` object (metaTitle/metaDescription/ogImage)
// to document.title and <head> meta tags. No react-helmet dependency —
// this is a client-only SPA with no SSR, so an imperative effect is enough.
export function useDocumentSeo(seo) {
  useEffect(() => {
    const title = seo?.metaTitle || DEFAULT_TITLE;
    document.title = title;
    upsertMeta("name", "description", seo?.metaDescription);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", seo?.metaDescription);
    if (seo?.ogImage) {
      upsertMeta("property", "og:image", urlFor(seo.ogImage).width(1200).height(630).url());
    }
  }, [seo]);
}
