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
    <main className="relative min-h-screen overflow-hidden bg-[#050408]">
      <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/10 bg-black/30 px-4 py-3 shadow-[0_24px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl">
          <Link href="/" className="flex h-[55px] w-[185px] items-center">
            <img
              src="/gaimin-avatar-logo.svg"
              alt="GAIMIN Avatar AI"
              className="h-[55px] w-[185px] object-contain"
            />
          </Link>
          <div className="flex items-center gap-3 rounded-md border border-[#8b00ff]/25 bg-[#8b00ff]/10 px-3 py-2 text-sm text-zinc-300">
            <Zap className="h-4 w-4 text-[#c084fc]" />
            <span>Made with GAIMIN Avatar AI</span>
          </div>
        </header>

        {payload ? (
          <div className="grid min-h-[calc(100vh-112px)] gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="rounded-lg border border-white/10 bg-[linear-gradient(145deg,rgba(18,10,33,0.94),rgba(3,5,9,0.96))] p-4 shadow-[0_34px_120px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-5">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-black uppercase text-[#c084fc]">
                    Shared avatar set
                  </p>
                  <h1 className="mt-2 text-3xl font-black leading-tight text-white sm:text-5xl">
                    {payload.styleName}
                  </h1>
                  <p className="mt-2 text-sm text-zinc-400">
                    Made with GAIMIN Avatar AI · {formatTimestamp(payload.createdAt)}
                  </p>
                </div>
                <Link href="/">
                  <Button type="button">
                    <ImagePlus className="h-4 w-4" />
                    Create Yours
                  </Button>
                </Link>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {payload.images.map((image, index) => (
                  <Card key={`${image.imageUrl}-${index}`} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={image.imageUrl}
                        alt={image.label}
                        className="aspect-square w-full object-cover"
                      />
                      <div className="absolute bottom-3 left-3 rounded bg-black/70 px-2 py-1 text-xs font-bold text-[#e9d5ff] backdrop-blur">
                        Made with GAIMIN Avatar AI
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 p-3">
                      <div>
                        <p className="text-sm font-bold text-white">
                          Variation {index + 1}
                        </p>
                        <p className="text-xs text-[#c084fc]">{payload.styleName}</p>
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

            <aside className="flex flex-col justify-between rounded-lg border border-white/10 bg-[#090712]/88 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl">
              <div>
                <p className="text-xs font-black uppercase text-[#c084fc]">
                  Next level
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  Make your own gaming avatar.
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Upload a selfie, choose a game-inspired style, and generate two
                  branded GAIMIN avatars ready to download or share.
                </p>
              </div>

              <div className="mt-6 grid gap-2">
                <Link href="/">
                  <Button type="button" className="w-full">
                    <ImagePlus className="h-4 w-4" />
                    Try GAIMIN Avatar AI
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={copyShareText}
                >
                  <Share2 className="h-4 w-4" />
                  Copy Share Text
                </Button>
                {copyStatus && (
                  <p className="rounded-md border border-[#8b00ff]/25 bg-[#8b00ff]/10 px-3 py-2 text-center text-sm font-semibold text-[#d8b4fe]">
                    {copyStatus}
                  </p>
                )}
              </div>
            </aside>
          </div>
        ) : (
          <section className="flex min-h-[calc(100vh-112px)] items-center justify-center rounded-lg border border-white/10 bg-[#090712]/88 p-6 text-center shadow-[0_28px_90px_rgba(0,0,0,0.36)] backdrop-blur-xl">
            <div className="max-w-md">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg border border-[#8b00ff]/30 bg-[#8b00ff]/12 text-[#e9d5ff]">
                <Share2 className="h-7 w-7" />
              </div>
              <h1 className="mt-4 text-2xl font-black text-white">
                Share link expired or invalid
              </h1>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                This temporary share page needs a valid generated avatar link.
              </p>
              <Link href="/" className="mt-5 inline-flex">
                <Button type="button">
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
