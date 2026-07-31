import { useEffect, useState } from "react";
import { sanityClient } from "./sanityClient.js";

// Fetch-on-mount, same style as SlotPicker's availability fetch. `data` stays
// null on error/loading so callers can fall back to hardcoded copy.
export function useSanityQuery(query, params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    sanityClient
      .fetch(query, params)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, JSON.stringify(params)]);

  return { data, loading, error };
}
