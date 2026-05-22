"use client";

import { useEffect, useState } from "react";

import { SharePageView } from "@/components/share-page-view";
import type { SharePayload } from "@/lib/share-store";

function decodeSharePayload(hash: string): SharePayload | null {
  if (!hash) return null;

  try {
    const paddedHash = hash.padEnd(hash.length + ((4 - (hash.length % 4)) % 4), "=");
    const encodedJson = atob(paddedHash.replaceAll("-", "+").replaceAll("_", "/"));
    const payload = JSON.parse(decodeURIComponent(encodedJson)) as SharePayload;

    if (!payload.styleName || !Array.isArray(payload.images)) return null;

    return payload;
  } catch {
    return null;
  }
}

export default function LegacySharePage() {
  const [payload, setPayload] = useState<SharePayload | null>(null);

  useEffect(() => {
    setPayload(decodeSharePayload(window.location.hash.slice(1)));
  }, []);

  return <SharePageView payload={payload} />;
}
