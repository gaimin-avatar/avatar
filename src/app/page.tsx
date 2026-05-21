"use client";

import {
  BadgeCheck,
  Blocks,
  Crown,
  Download,
  Gamepad2,
  ImagePlus,
  Loader2,
  Radio,
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

function downloadImage(url: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.target = "_blank";
  anchor.click();
}

export default function Home() {
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyleId>("cyber-esports");
  const [variationCount, setVariationCount] = useState(4);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedAvatar[]>([]);
  const [error, setError] = useState("");

  const activeStyle = useMemo(
    () => styles.find((style) => style.id === selectedStyle) ?? styles[0],
    [selectedStyle],
  );

  function handleUpload(file?: File) {
    if (!file) return;
    setSelectedFile(file);
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    setResults([]);
    setError("");
  }

  async function handleGenerate() {
    if (!selectedFile) return;

    setIsGenerating(true);
    setResults([]);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("style", activeStyle.id);
      formData.append("variations", String(variationCount));

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as {
        images?: GeneratedAvatar[];
        error?: string;
      };

      if (!response.ok || !payload.images) {
        throw new Error(payload.error ?? "Generation failed.");
      }

      setResults(payload.images);
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Generation failed.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function downloadAll() {
    results.forEach((result, index) => {
      setTimeout(
        () => downloadImage(result.imageUrl, `gaimin-avatar-${index + 1}.jpg`),
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
                  disabled={!selectedFile || isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trophy className="h-4 w-4" />
                  )}
                  Generate
                </Button>
              </div>
              {error && (
                <p className="mt-3 text-sm font-semibold text-red-300">{error}</p>
              )}
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
                            downloadImage(
                              result.imageUrl,
                              `gaimin-avatar-${index + 1}.jpg`,
                            )
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
