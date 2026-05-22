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
import { avatarStyles } from "@/lib/avatar-styles";
import { cn } from "@/lib/utils";
import type { AvatarStyleId, GeneratedAvatar } from "@/types/avatar";

const styleIcons: Record<AvatarStyleId, typeof Shield> = {
  "battle-royale": Shield,
  "block-world": Blocks,
  "cyber-esports": Radio,
  "fantasy-rpg": Crown,
  "anime-arena": Swords,
  "pixel-arcade": Gamepad2,
};

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };

    return entities[character];
  });
}

function brandedAvatarSvg(imageUrl: string, label: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <image href="${escapeXml(imageUrl)}" x="0" y="0" width="1024" height="1024" preserveAspectRatio="xMidYMid slice"/>
      <rect x="0" y="912" width="1024" height="112" fill="rgba(0,0,0,0.48)"/>
      <text x="52" y="982" fill="#d9f99d" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="800">Made with GAIMIN Avatar AI</text>
      <text x="972" y="982" text-anchor="end" fill="#ffffff" opacity="0.78" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">${escapeXml(label)}</text>
    </svg>
  `)}`;
}

function gamerCardSvg(imageUrl: string, styleName: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#84cc16"/>
          <stop offset="46%" stop-color="#09090b"/>
          <stop offset="100%" stop-color="#22d3ee"/>
        </linearGradient>
      </defs>
      <rect width="1400" height="900" rx="44" fill="url(#bg)"/>
      <rect x="44" y="44" width="1312" height="812" rx="32" fill="rgba(0,0,0,0.64)" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
      <image href="${escapeXml(imageUrl)}" x="86" y="86" width="728" height="728" preserveAspectRatio="xMidYMid slice"/>
      <text x="880" y="186" fill="#d9f99d" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="900">GAIMIN Avatar AI</text>
      <text x="880" y="286" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="74" font-weight="900">${escapeXml(styleName)}</text>
      <text x="880" y="382" fill="#d4d4d8" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700">Next Level Gamer Identity</text>
      <text x="880" y="720" fill="#ffffff" opacity="0.86" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700">Made with GAIMIN Avatar AI</text>
      <text x="880" y="770" fill="#d9f99d" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">Launcher • GGPL • Club</text>
    </svg>
  `)}`;
}

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
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  const activeStyle = useMemo(
    () =>
      avatarStyles.find((style) => style.id === selectedStyle) ?? avatarStyles[0],
    [selectedStyle],
  );

  function track(name: string, data?: Record<string, unknown>) {
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, data }),
    }).catch(() => undefined);
  }

  function handleUpload(file?: File) {
    if (!file) return;
    setSelectedFile(file);
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    setResults([]);
    setError("");
    track("avatar_upload", { type: file.type, size: file.size });
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
      track("avatar_generate_success", {
        style: activeStyle.id,
        variations: payload.images.length,
      });
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Generation failed.",
      );
      track("avatar_generate_error", { style: activeStyle.id });
    } finally {
      setIsGenerating(false);
    }
  }

  function downloadAll() {
    results.forEach((result, index) => {
      setTimeout(
        () =>
          downloadImage(
            brandedAvatarSvg(result.imageUrl, result.label),
            `gaimin-avatar-${index + 1}.svg`,
          ),
        index * 120,
      );
    });

    if (results[0]) {
      setTimeout(
        () =>
          downloadImage(
            gamerCardSvg(results[0].imageUrl, activeStyle.name),
            "gaimin-gamer-card.svg",
          ),
        results.length * 120,
      );
    }

    track("avatar_download_all", { count: results.length });
  }

  function downloadGamerCard() {
    const primary = results[0];
    if (!primary) return;

    downloadImage(
      gamerCardSvg(primary.imageUrl, activeStyle.name),
      "gaimin-gamer-card.svg",
    );
    track("avatar_download_gamer_card", { style: activeStyle.id });
  }

  async function shareAvatar() {
    const shareData = {
      title: "GAIMIN Avatar AI",
      text: "I made a game-ready avatar with GAIMIN Avatar AI.",
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }

    track("avatar_share", { style: activeStyle.id });
  }

  async function captureEmail() {
    setEmailStatus("");
    const response = await fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setEmailStatus(response.ok ? "You're on the list." : "Enter a valid email.");
    if (response.ok) {
      setEmail("");
      track("avatar_email_capture");
    }
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
              {avatarStyles.map((style) => {
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
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={downloadGamerCard}
                    >
                      <Trophy className="h-4 w-4" />
                      Gamer Card
                    </Button>
                    <Button variant="secondary" size="sm" onClick={shareAvatar}>
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {results.map((result, index) => (
                    <Card key={result.id} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={result.imageUrl}
                          alt={result.label}
                          className="aspect-square w-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 rounded bg-black/55 px-2 py-1 text-xs font-bold text-lime-200">
                          Made with GAIMIN Avatar AI
                        </div>
                      </div>
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
                              brandedAvatarSvg(result.imageUrl, result.label),
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
                    <h3 className="font-bold text-white">Next Level</h3>
                    <p className="text-sm text-zinc-400">
                      Get launch updates for GAIMIN Launcher, GGPL, and Club.
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
                    <Button type="button" variant="secondary" onClick={captureEmail}>
                      Join
                    </Button>
                  </div>
                  {emailStatus && (
                    <p className="text-sm font-semibold text-lime-300">
                      {emailStatus}
                    </p>
                  )}
                </Card>
              </section>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
