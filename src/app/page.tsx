"use client";

import {
  BadgeCheck,
  Blocks,
  Crown,
  Download,
  Gamepad2,
  ImagePlus,
  Loader2,
  Mail,
  Radio,
  Share2,
  Shield,
  Swords,
  Trophy,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AvatarStyle, AvatarStyleId, GeneratedAvatar } from "@/types/avatar";

const styles: AvatarStyle[] = [
  {
    id: "battle-royale",
    name: "Battle Royale Hero",
    description: "cinematic squad-leader energy",
    accent: "from-amber-300 to-red-500",
  },
  {
    id: "block-world",
    name: "Block World Adventurer",
    description: "chunky explorer, bright loot colors",
    accent: "from-emerald-300 to-sky-400",
  },
  {
    id: "cyber-esports",
    name: "Cyber Esports Pro",
    description: "neon jersey, arena lighting",
    accent: "from-cyan-300 to-fuchsia-500",
  },
  {
    id: "fantasy-rpg",
    name: "Fantasy RPG Champion",
    description: "legendary armor and guild prestige",
    accent: "from-violet-300 to-yellow-300",
  },
  {
    id: "anime-arena",
    name: "Anime Arena Fighter",
    description: "bold linework and power aura",
    accent: "from-rose-300 to-indigo-400",
  },
  {
    id: "pixel-arcade",
    name: "Pixel Arcade Legend",
    description: "retro icon with high-score swagger",
    accent: "from-lime-300 to-orange-400",
  },
];

const styleIcons: Record<AvatarStyleId, typeof Shield> = {
  "battle-royale": Shield,
  "block-world": Blocks,
  "cyber-esports": Radio,
  "fantasy-rpg": Crown,
  "anime-arena": Swords,
  "pixel-arcade": Gamepad2,
};

function svgAvatar(style: AvatarStyle, index: number) {
  const seed = `${style.id}-${index}`;
  const title = `${style.name} ${index}`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${index % 2 ? "#84cc16" : "#22d3ee"}"/>
          <stop offset="48%" stop-color="${index % 3 ? "#18181b" : "#a855f7"}"/>
          <stop offset="100%" stop-color="${index % 2 ? "#f97316" : "#f43f5e"}"/>
        </linearGradient>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.18"/>
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width="1024" height="1024" fill="url(#bg)"/>
      <rect width="1024" height="1024" filter="url(#noise)" opacity="0.28"/>
      <circle cx="512" cy="384" r="172" fill="#f4f4f5" opacity="0.92"/>
      <path d="M230 900c44-186 156-278 282-278s238 92 282 278" fill="#09090b" opacity="0.88"/>
      <path d="M326 356c76-132 289-132 372 0-38-31-89-49-186-49s-148 18-186 49z" fill="#09090b"/>
      <rect x="128" y="126" width="768" height="768" rx="56" fill="none" stroke="#ffffff" stroke-width="18" opacity="0.18"/>
      <text x="512" y="830" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="800">${title}</text>
      <text x="512" y="902" text-anchor="middle" fill="#d9f99d" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700">Made with GAIMIN</text>
      <desc>${seed}</desc>
    </svg>
  `)}`;
}

function downloadDataUrl(url: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
}

export default function Home() {
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyleId>("cyber-esports");
  const [variationCount, setVariationCount] = useState(4);
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedAvatar[]>([]);
  const [email, setEmail] = useState("");

  const activeStyle = useMemo(
    () => styles.find((style) => style.id === selectedStyle) ?? styles[0],
    [selectedStyle],
  );

  function handleUpload(file?: File) {
    if (!file) return;
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    setResults([]);
  }

  async function handleGenerate() {
    if (!previewUrl) return;

    setIsGenerating(true);
    setResults([]);

    await new Promise((resolve) => setTimeout(resolve, 900));

    setResults(
      Array.from({ length: variationCount }, (_, index) => ({
        id: `${activeStyle.id}-${index + 1}`,
        label: `${activeStyle.name} ${index + 1}`,
        imageUrl: svgAvatar(activeStyle, index + 1),
      })),
    );
    setIsGenerating(false);
  }

  function downloadGamerCard() {
    const card = results[0] ?? {
      label: activeStyle.name,
      imageUrl: svgAvatar(activeStyle, 1),
    };
    downloadDataUrl(card.imageUrl, "gaimin-gamer-card.svg");
  }

  function downloadAll() {
    results.forEach((result, index) => {
      setTimeout(
        () => downloadDataUrl(result.imageUrl, `gaimin-avatar-${index + 1}.svg`),
        index * 120,
      );
    });
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-5 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-lime-400 text-zinc-950">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-lime-300">GAIMIN</p>
              <h1 className="text-xl font-black tracking-normal text-white">
                Avatar AI
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <BadgeCheck className="h-4 w-4 text-lime-300" />
            <span>Upload to branded gamer avatar in seconds</span>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)]">
          <section className="flex flex-col gap-5">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-lime-300">
                avatar.gaimin.gg
              </p>
              <h2 className="max-w-3xl text-4xl font-black tracking-normal text-white sm:text-5xl">
                Generate your game-ready identity.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
                Upload a selfie or profile picture, choose a gaming style, and
                export branded avatars built for sharing.
              </p>
            </div>

            <Card className="p-4">
              <label
                htmlFor="avatar-upload"
                className="flex min-h-72 cursor-pointer flex-col items-center justify-center gap-4 rounded-md border border-dashed border-zinc-700 bg-zinc-900/60 p-6 text-center transition hover:border-lime-300"
              >
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Uploaded avatar preview"
                    className="h-44 w-44 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-md bg-zinc-800 text-lime-300">
                    <ImagePlus className="h-8 w-8" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-white">
                    {fileName || "Upload selfie, avatar, or profile picture"}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    PNG, JPG, or WEBP. Keep the face visible for best output.
                  </p>
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) => handleUpload(event.target.files?.[0])}
                />
              </label>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white">Variations</h3>
                  <p className="text-sm text-zinc-400">Generate 1 to 4 outputs.</p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setVariationCount(count)}
                      className={cn(
                        "h-10 w-10 rounded-md border text-sm font-bold transition",
                        variationCount === count
                          ? "border-lime-300 bg-lime-300 text-zinc-950"
                          : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500",
                      )}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </section>

          <section className="flex flex-col gap-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {styles.map((style) => {
                const Icon = styleIcons[style.id];
                const isSelected = selectedStyle === style.id;

                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style.id)}
                    className={cn(
                      "group rounded-lg border bg-zinc-950 p-4 text-left transition",
                      isSelected
                        ? "border-lime-300 shadow-[0_0_0_1px_rgba(190,242,100,0.8)]"
                        : "border-zinc-800 hover:border-zinc-600",
                    )}
                  >
                    <div
                      className={cn(
                        "mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br text-zinc-950",
                        style.accent,
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-black text-white">{style.name}</h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      {style.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <Card className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold text-white">Ready to generate</h3>
                  <p className="text-sm text-zinc-400">
                    {activeStyle.name} x {variationCount}
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!previewUrl || isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trophy className="h-4 w-4" />
                  )}
                  Generate
                </Button>
              </div>
            </Card>

            {results.length > 0 && (
              <section className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-black text-white">Generated avatars</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm" onClick={downloadAll}>
                      <Download className="h-4 w-4" />
                      All
                    </Button>
                    <Button variant="secondary" size="sm" onClick={downloadGamerCard}>
                      <Trophy className="h-4 w-4" />
                      Gamer Card
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        navigator.share?.({
                          title: "GAIMIN Avatar AI",
                          text: "Made with GAIMIN Avatar AI",
                          url: window.location.href,
                        })
                      }
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {results.map((result, index) => (
                    <Card key={result.id} className="overflow-hidden">
                      <img
                        src={result.imageUrl}
                        alt={result.label}
                        className="aspect-square w-full object-cover"
                      />
                      <div className="flex items-center justify-between gap-3 p-3">
                        <div>
                          <p className="text-sm font-bold text-white">
                            Variation {index + 1}
                          </p>
                          <p className="text-xs text-lime-300">Made with GAIMIN</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Download variation ${index + 1}`}
                          onClick={() =>
                            downloadDataUrl(
                              result.imageUrl,
                              `gaimin-avatar-${index + 1}.svg`,
                            )
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <h3 className="font-bold text-white">Get the GAIMIN drop</h3>
                    <p className="text-sm text-zinc-400">
                      Capture emails for launch updates, rewards, and ecosystem
                      onboarding.
                    </p>
                  </div>
                  <div className="flex min-w-0 flex-1 gap-2">
                    <div className="relative min-w-0 flex-1">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="player@email.com"
                        className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-900 py-2 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-lime-300"
                      />
                    </div>
                    <Button type="button" variant="secondary">
                      Join
                    </Button>
                  </div>
                </Card>
              </section>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
