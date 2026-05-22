"use client";

import { Download, ImagePlus, Share2, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type SharedImage = {
  imageUrl: string;
  label: string;
};

type SharePayload = {
  styleName: string;
  createdAt: string;
  images: SharedImage[];
};

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

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function downloadImage(url: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.target = "_blank";
  anchor.click();
}

export default function SharePage() {
  const [payload, setPayload] = useState<SharePayload | null>(null);
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    setPayload(decodeSharePayload(window.location.hash.slice(1)));
  }, []);

  const shareText = useMemo(() => {
    if (!payload) return "";

    return `Just became a ${payload.styleName} on GAIMIN Avatar AI. Made with GAIMIN Avatar AI. Create yours: ${window.location.origin}`;
  }, [payload]);

  async function copyShareText() {
    await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
    setCopyStatus("Share text copied.");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#07070a] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,rgba(139,0,255,0.12)_0%,transparent_34%),linear-gradient(205deg,rgba(255,255,255,0.045)_0%,transparent_28%),linear-gradient(180deg,#101014_0%,#07070a_44%,#030304_100%)]" />
      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1180px] flex-col gap-3 px-3 py-3 sm:px-5 lg:px-6">
        <header className="flex items-center justify-between rounded-full border border-white/[0.08] bg-white/[0.045] px-3 py-2 backdrop-blur-2xl">
          <Link href="/" className="flex items-center">
            <img
              src="/gaimin-avatar-logo.svg"
              alt="GAIMIN Avatar AI"
              className="h-9 w-[128px] object-contain sm:h-10 sm:w-[142px]"
            />
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/25 px-3 py-2 text-xs text-zinc-300">
            <Zap className="h-4 w-4 text-[#c084fc]" />
            <span className="hidden sm:inline">Made with GAIMIN Avatar AI</span>
          </div>
        </header>

        {payload ? (
          <div className="grid flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_310px]">
            <section className="rounded-[18px] border border-white/[0.08] bg-white/[0.045] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.08] pb-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c4b5fd]">
                    Shared avatar set
                  </p>
                  <h1 className="mt-1 text-[30px] font-semibold leading-[0.98] tracking-[-0.04em] text-zinc-50 sm:text-[42px]">
                    {payload.styleName}
                  </h1>
                  <p className="mt-2 text-xs text-zinc-500">
                    Made with GAIMIN Avatar AI · {formatTimestamp(payload.createdAt)}
                  </p>
                </div>
                <Link href="/">
                  <Button type="button" className="rounded-full">
                    <ImagePlus className="h-4 w-4" />
                    Create Yours
                  </Button>
                </Link>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {payload.images.map((image, index) => (
                  <Card
                    key={`${image.imageUrl}-${index}`}
                    className="overflow-hidden rounded-[18px] bg-white/[0.035]"
                  >
                    <div className="relative">
                      <img
                        src={image.imageUrl}
                        alt={image.label}
                        className="aspect-square w-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-medium text-[#e9d5ff] backdrop-blur">
                        GAIMIN Avatar AI
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 p-2.5">
                      <div>
                        <p className="text-xs font-semibold text-white">
                          Variation {index + 1}
                        </p>
                        <p className="text-[11px] text-[#c4b5fd]">{payload.styleName}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Download shared variation ${index + 1}`}
                        onClick={() =>
                          downloadImage(image.imageUrl, `gaimin-avatar-${index + 1}.png`)
                        }
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <aside className="flex flex-col justify-between rounded-[18px] border border-white/[0.08] bg-white/[0.045] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c4b5fd]">
                  Next level
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">
                  Make your own gaming avatar.
                </h2>
                <p className="mt-3 text-xs leading-5 text-zinc-500">
                  Upload a selfie, choose a game-inspired style, and generate two
                  branded GAIMIN avatars ready to download or share.
                </p>
              </div>

              <div className="mt-6 grid gap-2">
                <Link href="/">
                  <Button type="button" className="w-full rounded-full">
                    <ImagePlus className="h-4 w-4" />
                    Try GAIMIN Avatar AI
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full rounded-full"
                  onClick={copyShareText}
                >
                  <Share2 className="h-4 w-4" />
                  Copy Share Text
                </Button>
                {copyStatus && (
                  <p className="rounded-[12px] border border-[#8b00ff]/20 bg-[#8b00ff]/10 px-3 py-2 text-center text-xs font-medium text-[#d8b4fe]">
                    {copyStatus}
                  </p>
                )}
              </div>
            </aside>
          </div>
        ) : (
          <section className="flex flex-1 items-center justify-center rounded-[18px] border border-white/[0.08] bg-white/[0.045] p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl">
            <div className="max-w-md">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/[0.06] text-[#d8b4fe]">
                <Share2 className="h-5 w-5" />
              </div>
              <h1 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-white">
                Share link expired or invalid
              </h1>
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                This temporary share page needs a valid generated avatar link.
              </p>
              <Link href="/" className="mt-5 inline-flex">
                <Button type="button" className="rounded-full">
                  <ImagePlus className="h-4 w-4" />
                  Create Yours
                </Button>
              </Link>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
