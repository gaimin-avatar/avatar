"use client";

import {
  BadgeCheck,
  Download,
  History,
  ImagePlus,
  Loader2,
  Mail,
  Share2,
  Trophy,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { avatarStyles } from "@/lib/avatar-styles";
import { cn } from "@/lib/utils";
import type { AvatarStyleId, GeneratedAvatar } from "@/types/avatar";

type ViewMode = "new" | "history";

type GenerationRecord = {
  id: string;
  styleId: AvatarStyleId;
  styleName: string;
  createdAt: string;
  images: GeneratedAvatar[];
  prompt?: string;
  sourceImageDataUri?: string;
};

type SharePayload = {
  styleName: string;
  createdAt: string;
  images: Pick<GeneratedAvatar, "imageUrl" | "label">[];
};

const styleMotifs: Record<AvatarStyleId, string> = {
  "battle-royale": "drop-zone vector",
  "block-world": "voxel compass",
  "cyber-esports": "neon scrim signal",
  "fantasy-rpg": "guild relic",
  "anime-arena": "aura burst",
  "pixel-arcade": "coin-op badge",
};

function StyleSigil({ id }: { id: AvatarStyleId }) {
  const common = "drop-shadow-[0_10px_26px_rgba(139,0,255,0.38)]";

  if (id === "battle-royale") {
    return (
      <svg viewBox="0 0 64 64" className={cn("h-9 w-9", common)} aria-hidden>
        <path d="M32 7 49 20v14c0 12-7 20-17 24-10-4-17-12-17-24V20L32 7Z" fill="url(#br)" />
        <path d="M32 18v28M18 32h28" stroke="white" strokeWidth="3" strokeLinecap="round" opacity=".9" />
        <circle cx="32" cy="32" r="9" fill="none" stroke="#09060f" strokeWidth="3" opacity=".85" />
        <defs><linearGradient id="br" x1="11" x2="53" y1="9" y2="56"><stop stopColor="#ff406d"/><stop offset="1" stopColor="#8b00ff"/></linearGradient></defs>
      </svg>
    );
  }

  if (id === "block-world") {
    return (
      <svg viewBox="0 0 64 64" className={cn("h-9 w-9", common)} aria-hidden>
        <path d="m20 20 12-7 12 7-12 7-12-7Z" fill="#93f4ff" />
        <path d="M20 20v15l12 7V27L20 20Z" fill="#725cff" />
        <path d="M44 20v15l-12 7V27l12-7Z" fill="#18c8ff" />
        <path d="m11 38 10-6 10 6-10 6-10-6Zm22 6 10-6 10 6-10 6-10-6Z" fill="#c6ff6b" />
        <path d="M21 44v10l-10-6V38l10 6Zm22 6v10l10-6V44l-10 6Z" fill="#725cff" opacity=".95" />
      </svg>
    );
  }

  if (id === "cyber-esports") {
    return (
      <svg viewBox="0 0 64 64" className={cn("h-9 w-9", common)} aria-hidden>
        <path d="M13 36c0-13 8-23 19-23s19 10 19 23" fill="none" stroke="url(#xp)" strokeWidth="6" strokeLinecap="round" />
        <path d="M16 35h8v14h-8a5 5 0 0 1-5-5v-4a5 5 0 0 1 5-5Zm32 0h-8v14h8a5 5 0 0 0 5-5v-4a5 5 0 0 0-5-5Z" fill="#111827" stroke="#9d7cff" strokeWidth="3" />
        <path d="M29 49h8m-17-8h4m16 0h4" stroke="#20d8ff" strokeWidth="3" strokeLinecap="round" />
        <defs><linearGradient id="xp" x1="9" x2="55" y1="17" y2="39"><stop stopColor="#8b00ff"/><stop offset="1" stopColor="#20d8ff"/></linearGradient></defs>
      </svg>
    );
  }

  if (id === "fantasy-rpg") {
    return (
      <svg viewBox="0 0 64 64" className={cn("h-9 w-9", common)} aria-hidden>
        <path d="M32 5 44 23 32 58 20 23 32 5Z" fill="url(#rp)" />
        <path d="M20 23h24M32 5v53M14 48l9-9M50 48l-9-9" stroke="white" strokeWidth="3" strokeLinecap="round" opacity=".8" />
        <path d="m32 18 5 8-5 8-5-8 5-8Z" fill="#09060f" opacity=".72" />
        <defs><linearGradient id="rp" x1="19" x2="45" y1="6" y2="58"><stop stopColor="#ffd166"/><stop offset=".48" stopColor="#c084fc"/><stop offset="1" stopColor="#8b00ff"/></linearGradient></defs>
      </svg>
    );
  }

  if (id === "anime-arena") {
    return (
      <svg viewBox="0 0 64 64" className={cn("h-9 w-9", common)} aria-hidden>
        <path d="M32 6 37 25l18-8-10 17 15 11-20 1-8 12-8-12-20-1 15-11L9 17l18 8L32 6Z" fill="url(#aa)" />
        <path d="M18 45 46 17M24 52l22-22" stroke="#09060f" strokeWidth="4" strokeLinecap="round" opacity=".78" />
        <path d="M17 45 45 17" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".88" />
        <defs><linearGradient id="aa" x1="7" x2="57" y1="8" y2="58"><stop stopColor="#ff7ad9"/><stop offset=".5" stopColor="#8b00ff"/><stop offset="1" stopColor="#ff8a3d"/></linearGradient></defs>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" className={cn("h-9 w-9", common)} aria-hidden>
      <path d="M13 15h38v34H13V15Z" fill="url(#px)" />
      <path d="M20 22h7v7h-7v-7Zm17 0h7v7h-7v-7ZM20 37h7v7h-7v-7Zm17 0h7v7h-7v-7Z" fill="#09060f" opacity=".8" />
      <path d="M11 9h11v6H11V9Zm31 40h11v6H42v-6ZM7 27h6v11H7V27Zm44-11h6v11h-6V16Z" fill="#c6ff6b" />
      <defs><linearGradient id="px" x1="12" x2="52" y1="15" y2="49"><stop stopColor="#f472b6"/><stop offset=".5" stopColor="#8b00ff"/><stop offset="1" stopColor="#20d8ff"/></linearGradient></defs>
    </svg>
  );
}

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
      <text x="52" y="982" fill="#c084fc" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="800">Made with GAIMIN Avatar AI</text>
      <text x="972" y="982" text-anchor="end" fill="#ffffff" opacity="0.78" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">${escapeXml(label)}</text>
    </svg>
  `)}`;
}

function gamerCardSvg(imageUrl: string, styleName: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#8b00ff"/>
          <stop offset="48%" stop-color="#090611"/>
          <stop offset="100%" stop-color="#00bfff"/>
        </linearGradient>
      </defs>
      <rect width="1400" height="900" rx="44" fill="url(#bg)"/>
      <rect x="44" y="44" width="1312" height="812" rx="32" fill="rgba(0,0,0,0.64)" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
      <image href="${escapeXml(imageUrl)}" x="86" y="86" width="728" height="728" preserveAspectRatio="xMidYMid slice"/>
      <text x="880" y="186" fill="#c084fc" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="900">GAIMIN Avatar AI</text>
      <text x="880" y="286" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="74" font-weight="900">${escapeXml(styleName)}</text>
      <text x="880" y="382" fill="#d4d4d8" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700">Next Level Gamer Identity</text>
      <text x="880" y="720" fill="#ffffff" opacity="0.86" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700">Made with GAIMIN Avatar AI</text>
      <text x="880" y="770" fill="#c084fc" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">Launcher • GGPL • Club</text>
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

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function readSessionHistory(): GenerationRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const storedHistory = window.sessionStorage.getItem("gaimin-avatar-history");
    if (!storedHistory) return [];

    const parsedHistory = JSON.parse(storedHistory) as GenerationRecord[];
    return Array.isArray(parsedHistory) ? parsedHistory : [];
  } catch {
    return [];
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

function encodeSharePayload(payload: SharePayload) {
  const encodedJson = encodeURIComponent(JSON.stringify(payload));
  return btoa(encodedJson)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

export default function Home() {
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyleId>("cyber-esports");
  const variationCount = 2;
  const [viewMode, setViewMode] = useState<ViewMode>("new");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [sourceImageDataUri, setSourceImageDataUri] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedAvatar[]>([]);
  const [generationHistory, setGenerationHistory] = useState<GenerationRecord[]>([]);
  const [historyReady, setHistoryReady] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const [unlockStatus, setUnlockStatus] = useState("");
  const [isUnlocking4k, setIsUnlocking4k] = useState(false);

  const activeStyle = useMemo(
    () =>
      avatarStyles.find((style) => style.id === selectedStyle) ?? avatarStyles[0],
    [selectedStyle],
  );

  const selectedHistory = useMemo(
    () =>
      generationHistory.find((generation) => generation.id === selectedHistoryId) ??
      generationHistory[0],
    [generationHistory, selectedHistoryId],
  );

  useEffect(() => {
    setGenerationHistory(readSessionHistory());
    setHistoryReady(true);
  }, []);

  useEffect(() => {
    if (!historyReady) return;

    window.sessionStorage.setItem(
      "gaimin-avatar-history",
      JSON.stringify(
        generationHistory.map(({ sourceImageDataUri: _sourceImageDataUri, ...generation }) => generation),
      ),
    );
  }, [generationHistory, historyReady]);

  function track(name: string, data?: Record<string, unknown>) {
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, data }),
    }).catch(() => undefined);
  }

  async function handleUpload(file?: File) {
    if (!file) return;
    setSelectedFile(file);
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    setSourceImageDataUri(await fileToDataUrl(file));
    setResults([]);
    setError("");
    setShareStatus("");
    setUnlockStatus("");
    track("avatar_upload", { type: file.type, size: file.size });
  }

  async function handleGenerate() {
    if (!selectedFile) return;

    setIsGenerating(true);
    setResults([]);
    setError("");
    setShareStatus("");
    setUnlockStatus("");

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
        prompt?: string;
        error?: string;
      };

      if (!response.ok || !payload.images) {
        throw new Error(payload.error ?? "Generation failed.");
      }

      const generation: GenerationRecord = {
        id: crypto.randomUUID(),
        styleId: activeStyle.id,
        styleName: activeStyle.name,
        createdAt: new Date().toISOString(),
        images: payload.images,
        prompt: payload.prompt,
        sourceImageDataUri,
      };

      setResults(payload.images);
      setGenerationHistory((historyItems) => [generation, ...historyItems]);
      setSelectedHistoryId(generation.id);
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

  function viewHistoryGeneration(generation: GenerationRecord) {
    setResults(generation.images);
    setSelectedStyle(generation.styleId);
    setSourceImageDataUri(generation.sourceImageDataUri ?? "");
    setSelectedHistoryId(generation.id);
    setViewMode("new");
    track("avatar_history_view", { style: generation.styleId });
  }

  function downloadGenerationSet(
    images: GeneratedAvatar[],
    styleName: string,
    filenamePrefix = "gaimin-avatar",
  ) {
    images.forEach((result, index) => {
      setTimeout(
        () =>
          downloadImage(
            brandedAvatarSvg(result.imageUrl, result.label),
            `${filenamePrefix}-${index + 1}.svg`,
          ),
        index * 120,
      );
    });

    if (images[0]) {
      setTimeout(
        () =>
          downloadImage(
            gamerCardSvg(images[0].imageUrl, styleName),
            "gaimin-gamer-card.svg",
          ),
        images.length * 120,
      );
    }
  }

  function downloadAll() {
    downloadGenerationSet(results, activeStyle.name);

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
    if (results.length === 0) return;

    const payload: SharePayload = {
      styleName: activeStyle.name,
      createdAt: new Date().toISOString(),
      images: results.map((result) => ({
        imageUrl: result.imageUrl,
        label: result.label,
      })),
    };
    const shareUrl = `${window.location.origin}/share#${encodeSharePayload(payload)}`;
    const shareText = `Just became a ${activeStyle.name} on GAIMIN Avatar AI. Made with GAIMIN Avatar AI. Check it out: ${shareUrl}`;
    const shareData = {
      title: "GAIMIN Avatar AI",
      text: shareText,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("Share sheet opened.");
      } else {
        await navigator.clipboard.writeText(shareText);
        setShareStatus("Share link copied.");
      }
    } catch {
      await navigator.clipboard.writeText(shareText);
      setShareStatus("Share link copied.");
    }

    track("avatar_share", { style: activeStyle.id, target: "share_page" });
  }

  async function unlock4k() {
    setUnlockStatus("");

    if (!results.length || !sourceImageDataUri) {
      setUnlockStatus("Generate an avatar first, then unlock 4K HD.");
      return;
    }

    if (!email.trim()) {
      setUnlockStatus("Enter your email to unlock 4K HD.");
      return;
    }

    setIsUnlocking4k(true);

    try {
      const response = await fetch("/api/unlock-4k", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          styleId: activeStyle.id,
          sourceImageDataUri,
          variations: results.length || 2,
        }),
      });
      const payload = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "4K unlock failed.");
      }

      setUnlockStatus(payload.message ?? "Check your email.");
      track("avatar_unlock_4k", { style: activeStyle.id });
    } catch (unlockError) {
      setUnlockStatus(
        unlockError instanceof Error ? unlockError.message : "4K unlock failed.",
      );
    } finally {
      setIsUnlocking4k(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050408]">
      <section className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/10 bg-black/30 px-4 py-3 shadow-[0_24px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-[55px] w-[185px] items-center">
              <img
                src="/gaimin-avatar-logo.svg"
                alt="GAIMIN Avatar AI"
                className="h-[55px] w-[185px] object-contain"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-lg border border-white/10 bg-black/35 p-1">
              {(["new", "history"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "flex h-9 items-center gap-2 rounded-md px-3 text-sm font-black transition",
                    viewMode === mode
                      ? "bg-[#8b00ff] text-white shadow-[0_0_24px_rgba(139,0,255,0.28)]"
                      : "text-zinc-400 hover:bg-white/[0.06] hover:text-white",
                  )}
                >
                  {mode === "new" ? (
                    <ImagePlus className="h-4 w-4" />
                  ) : (
                    <History className="h-4 w-4" />
                  )}
                  {mode === "new" ? "New Generation" : "History"}
                  {mode === "history" && generationHistory.length > 0 && (
                    <span className="rounded bg-black/35 px-1.5 py-0.5 text-[11px]">
                      {generationHistory.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 rounded-md border border-[#8b00ff]/25 bg-[#8b00ff]/10 px-3 py-2 text-sm text-zinc-300">
              <BadgeCheck className="h-4 w-4 text-[#c084fc]" />
              <span>2 premium outputs per generation</span>
            </div>
          </div>
        </header>

        {viewMode === "new" ? (
        <div className="grid min-h-[calc(100vh-112px)] gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="flex flex-col gap-4 rounded-lg border border-white/10 bg-[#090712]/88 p-3 shadow-[0_28px_90px_rgba(0,0,0,0.36)] backdrop-blur-xl">
            <div className="px-2 py-2">
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase text-[#c084fc]">
                <Zap className="h-3.5 w-3.5" />
                avatar.gaimin.gg
              </p>
              <h1 className="mt-2 text-2xl font-black leading-tight text-white">
                Build a gamer identity.
              </h1>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Pick one visual lane. GAIMIN generates exactly two branded avatars.
              </p>
            </div>

            <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-black/28">
              {avatarStyles.map((style) => {
                const isSelected = selectedStyle === style.id;

                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style.id)}
                    className={cn(
                      "group relative flex min-h-[76px] items-center gap-3 border-b border-white/10 px-3 py-3 text-left transition last:border-b-0",
                      isSelected
                        ? "bg-[#8b00ff]/18 shadow-[inset_3px_0_0_#8b00ff]"
                        : "hover:bg-white/[0.05]",
                    )}
                  >
                    <div
                      className={cn(
                        "grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br shadow-[0_12px_32px_rgba(0,0,0,0.3)]",
                        style.accent,
                      )}
                    >
                      <StyleSigil id={style.id} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="font-black text-white">{style.name}</h3>
                        <span className="text-[11px] font-bold uppercase text-[#c084fc]">
                          {styleMotifs[style.id]}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-400">
                        {style.description}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "h-2.5 w-2.5 shrink-0 rounded-full border transition",
                        isSelected
                          ? "border-[#c084fc] bg-[#8b00ff] shadow-[0_0_18px_rgba(139,0,255,0.75)]"
                          : "border-white/20 bg-white/5",
                      )}
                    />
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 px-1">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[11px] font-black uppercase text-zinc-500">
                  Outputs
                </p>
                <p className="mt-1 text-2xl font-black text-white">2</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[11px] font-black uppercase text-zinc-500">
                  Branding
                </p>
                <p className="mt-1 text-sm font-black text-[#d8b4fe]">GAIMIN</p>
              </div>
            </div>
          </aside>

          <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
            <div className="flex min-h-[540px] flex-col rounded-lg border border-white/10 bg-[linear-gradient(145deg,rgba(18,10,33,0.94),rgba(3,5,9,0.96))] p-4 shadow-[0_34px_120px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-black uppercase text-[#c084fc]">
                    {activeStyle.name}
                  </p>
                  <h2 className="mt-1 text-3xl font-black leading-tight text-white sm:text-5xl">
                    Generate your game-ready identity.
                  </h2>
                </div>
                <div
                  className={cn(
                    "grid h-16 w-16 place-items-center rounded-lg border border-white/10 bg-gradient-to-br",
                    activeStyle.accent,
                  )}
                >
                  <StyleSigil id={activeStyle.id} />
                </div>
              </div>

              <label
                htmlFor="avatar-upload"
                className="group relative mt-4 flex flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-white/15 bg-black/28 p-5 text-center transition hover:border-[#8b00ff]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,0,255,0.22),transparent_42%),linear-gradient(135deg,rgba(255,255,255,0.055),transparent_35%)] opacity-90" />
                {previewUrl ? (
                  <div className="relative flex w-full max-w-xl flex-col items-center gap-4">
                    <img
                      src={previewUrl}
                      alt="Uploaded avatar preview"
                      className="aspect-square w-full max-w-[430px] rounded-lg border border-white/10 object-cover shadow-[0_0_70px_rgba(139,0,255,0.23)]"
                    />
                    <p className="max-w-full truncate text-sm font-bold text-zinc-300">
                      {fileName}
                    </p>
                  </div>
                ) : (
                  <div className="relative flex max-w-md flex-col items-center gap-4">
                    <div className="grid h-20 w-20 place-items-center rounded-lg border border-[#8b00ff]/35 bg-[#8b00ff]/15 text-[#e9d5ff] shadow-[0_0_60px_rgba(139,0,255,0.2)] transition group-hover:scale-[1.03]">
                      <ImagePlus className="h-9 w-9" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-white">
                        Drop in a selfie or profile picture
                      </p>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">
                        PNG, JPG, or WEBP. Clear face framing gives the best AI output.
                      </p>
                    </div>
                  </div>
                )}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) => handleUpload(event.target.files?.[0])}
                />
              </label>

              <div className="mt-4 flex flex-col gap-3 rounded-lg border border-white/10 bg-black/30 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h3 className="font-black text-white">Ready to generate</h3>
                  <p className="truncate text-sm text-zinc-400">
                    {activeStyle.name} · 2 variations · watermark included
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!selectedFile || isGenerating}
                  className="min-w-40"
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
            </div>

            {results.length > 0 && (
              <section className="flex flex-col gap-4 rounded-lg border border-white/10 bg-[#090712]/88 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-black text-white">Output deck</h3>
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
                {shareStatus && (
                  <p className="rounded-md border border-[#8b00ff]/25 bg-[#8b00ff]/10 px-3 py-2 text-sm font-semibold text-[#d8b4fe]">
                    {shareStatus}
                  </p>
                )}

                <div className="grid gap-3">
                  {results.map((result, index) => (
                    <Card key={result.id} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={result.imageUrl}
                          alt={result.label}
                          className="aspect-square w-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 rounded bg-black/65 px-2 py-1 text-xs font-bold text-[#e9d5ff] backdrop-blur">
                          Made with GAIMIN Avatar AI
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 p-3">
                        <div>
                          <p className="text-sm font-bold text-white">
                            Variation {index + 1}
                          </p>
                          <p className="text-xs text-[#c084fc]">Made with GAIMIN</p>
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
                <Card className="relative overflow-hidden p-4">
                  <div className="absolute -right-14 -top-16 h-36 w-36 rounded-full bg-[#8b00ff]/25 blur-3xl" />
                  <div className="relative flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[#8b00ff]/30 bg-[#8b00ff]/15 text-[#e9d5ff]">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-black text-white">Want 4K HD versions?</h3>
                        <p className="mt-1 text-sm leading-6 text-zinc-400">
                          Enter your email to unlock 4K HD upgrades, save this avatar
                          set, and get GAIMIN Launcher, GGPL, and Club updates.
                        </p>
                      </div>
                    </div>
                    <div className="flex min-w-0 gap-2">
                      <div className="relative min-w-0 flex-1">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="player@email.com"
                          className="h-11 w-full rounded-md border border-white/10 bg-black/35 py-2 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#8b00ff]"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={unlock4k}
                        disabled={isUnlocking4k}
                      >
                        {isUnlocking4k ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Zap className="h-4 w-4" />
                        )}
                        Unlock 4K
                      </Button>
                    </div>
                    {unlockStatus && (
                      <p className="rounded-md border border-[#8b00ff]/25 bg-[#8b00ff]/10 px-3 py-2 text-sm font-semibold text-[#d8b4fe]">
                        {unlockStatus}
                      </p>
                    )}
                  </div>
                </Card>
              </section>
            )}

            {results.length === 0 && (
              <aside className="flex flex-col justify-between rounded-lg border border-white/10 bg-[#090712]/88 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl">
                <div>
                  <h3 className="text-lg font-black text-white">Output deck</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    Your two generated avatars appear here with download, gamer card,
                    and share controls.
                  </p>
                </div>
                <div className="mt-6 grid gap-3">
                  {[1, 2].map((slot) => (
                    <div
                      key={slot}
                      className="aspect-square rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(139,0,255,0.12),rgba(255,255,255,0.035))]"
                    />
                  ))}
                </div>
              </aside>
            )}
          </section>
        </div>
        ) : (
          <section className="grid min-h-[calc(100vh-112px)] gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
            <div className="rounded-lg border border-white/10 bg-[#090712]/88 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.36)] backdrop-blur-xl sm:p-5">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-black uppercase text-[#c084fc]">
                    <History className="h-3.5 w-3.5" />
                    My Generations
                  </p>
                  <h1 className="mt-2 text-3xl font-black leading-tight text-white sm:text-5xl">
                    Session history.
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                    Every generation from this browser session stays here until the tab
                    session ends.
                  </p>
                </div>
                <Button type="button" variant="secondary" onClick={() => setViewMode("new")}>
                  <ImagePlus className="h-4 w-4" />
                  New
                </Button>
              </div>

              {generationHistory.length === 0 ? (
                <div className="mt-5 flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-dashed border-white/12 bg-black/24 p-6 text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-lg border border-[#8b00ff]/30 bg-[#8b00ff]/12 text-[#e9d5ff]">
                    <History className="h-7 w-7" />
                  </div>
                  <h2 className="mt-4 text-xl font-black text-white">
                    No generations yet
                  </h2>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-400">
                    Create your first two-avatar set, then come back here to view
                    and download it again.
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {generationHistory.map((generation) => (
                    <article
                      key={generation.id}
                      className={cn(
                        "overflow-hidden rounded-lg border bg-[#111019] transition",
                        selectedHistory?.id === generation.id
                          ? "border-[#8b00ff] shadow-[0_0_36px_rgba(139,0,255,0.2)]"
                          : "border-white/10 hover:border-white/25",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedHistoryId(generation.id)}
                        className="block w-full text-left"
                      >
                        <div className="relative aspect-square overflow-hidden bg-black">
                          <img
                            src={generation.images[0]?.imageUrl}
                            alt={`${generation.styleName} generation`}
                            className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
                          />
                          <div className="absolute left-3 top-3 rounded bg-black/70 px-2 py-1 text-[11px] font-black uppercase text-[#e9d5ff] backdrop-blur">
                            {generation.images.length} outputs
                          </div>
                        </div>
                        <div className="p-3">
                          <h2 className="truncate text-sm font-black text-white">
                            {generation.styleName}
                          </h2>
                          <p className="mt-1 text-xs text-zinc-500">
                            {formatTimestamp(generation.createdAt)}
                          </p>
                        </div>
                      </button>
                      <div className="grid grid-cols-2 gap-2 border-t border-white/10 p-3">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => viewHistoryGeneration(generation)}
                        >
                          View
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            downloadGenerationSet(
                              generation.images,
                              generation.styleName,
                              `gaimin-avatar-${generation.styleId}`,
                            )
                          }
                        >
                          <Download className="h-4 w-4" />
                          All
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <aside className="flex flex-col gap-4 rounded-lg border border-white/10 bg-[#090712]/88 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl">
              <div>
                <h2 className="text-lg font-black text-white">Selected set</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {selectedHistory
                    ? `${selectedHistory.styleName} · ${formatTimestamp(selectedHistory.createdAt)}`
                    : "Choose a generation to preview it."}
                </p>
              </div>

              {selectedHistory ? (
                <>
                  <div className="grid gap-3">
                    {selectedHistory.images.map((result, index) => (
                      <Card key={result.id} className="overflow-hidden">
                        <div className="relative">
                          <img
                            src={result.imageUrl}
                            alt={result.label}
                            className="aspect-square w-full object-cover"
                          />
                          <div className="absolute bottom-3 left-3 rounded bg-black/65 px-2 py-1 text-xs font-bold text-[#e9d5ff] backdrop-blur">
                            Made with GAIMIN Avatar AI
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-3 p-3">
                          <div>
                            <p className="text-sm font-bold text-white">
                              Variation {index + 1}
                            </p>
                            <p className="text-xs text-[#c084fc]">
                              {selectedHistory.styleName}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Download history variation ${index + 1}`}
                            onClick={() =>
                              downloadImage(
                                brandedAvatarSvg(result.imageUrl, result.label),
                                `gaimin-history-avatar-${index + 1}.svg`,
                              )
                            }
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        downloadGenerationSet(
                          selectedHistory.images,
                          selectedHistory.styleName,
                          `gaimin-avatar-${selectedHistory.styleId}`,
                        )
                      }
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => viewHistoryGeneration(selectedHistory)}
                    >
                      <Trophy className="h-4 w-4" />
                      View
                    </Button>
                  </div>
                </>
              ) : (
                <div className="grid gap-3">
                  {[1, 2].map((slot) => (
                    <div
                      key={slot}
                      className="aspect-square rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(139,0,255,0.12),rgba(255,255,255,0.035))]"
                    />
                  ))}
                </div>
              )}
            </aside>
          </section>
        )}
      </section>
    </main>
  );
}
