"use client";

import {
  Download,
  History,
  ImagePlus,
  Loader2,
  Mail,
  Share2,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { avatarStyles } from "@/lib/avatar-styles";
import type { SharePayload } from "@/lib/share-store";
import { cn } from "@/lib/utils";
import type { AvatarStyleId, GeneratedAvatar } from "@/types/avatar";

type ViewMode = "create" | "history";

type GenerationRecord = {
  id: string;
  styleId: AvatarStyleId;
  styleName: string;
  createdAt: string;
  images: GeneratedAvatar[];
  prompt?: string;
  sourceImageDataUri?: string;
};

const styleMotifs: Record<AvatarStyleId, string> = {
  "battle-royale": "squad lead",
  "block-world": "voxel quest",
  "cyber-esports": "arena pro",
  "fantasy-rpg": "guild rank",
  "anime-arena": "power aura",
  "pixel-arcade": "coin-op icon",
  "stealth-ops": "covert noir",
  "space-ranger": "orbital patrol",
  "racing-drift": "night circuit",
  "wasteland-survivor": "dust legend",
};

function StyleSigil({ id }: { id: AvatarStyleId }) {
  const common = "h-6 w-6 drop-shadow-[0_8px_18px_rgba(139,0,255,0.28)]";
  const stroke = "rgba(255,255,255,.92)";

  if (id === "battle-royale") {
    return (
      <svg viewBox="0 0 48 48" className={common} aria-hidden>
        <path d="M24 5 37 14v12c0 9-5 15-13 18-8-3-13-9-13-18V14L24 5Z" fill="url(#battle)" />
        <path d="M24 14v21M14 24h20" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="24" cy="24" r="7" fill="none" stroke="#07040b" strokeWidth="2.3" />
        <defs><linearGradient id="battle" x1="9" x2="39" y1="7" y2="42"><stop stopColor="#ff496b" /><stop offset="1" stopColor="#8b00ff" /></linearGradient></defs>
      </svg>
    );
  }

  if (id === "block-world") {
    return (
      <svg viewBox="0 0 48 48" className={common} aria-hidden>
        <path d="m16 15 8-5 8 5-8 5-8-5Z" fill="#d9fff4" />
        <path d="M16 15v11l8 5V20l-8-5Z" fill="#805cff" />
        <path d="M32 15v11l-8 5V20l8-5Z" fill="#25c7ff" />
        <path d="m8 30 8-5 8 5-8 5-8-5Zm16 5 8-5 8 5-8 5-8-5Z" fill="#caff6a" />
      </svg>
    );
  }

  if (id === "cyber-esports") {
    return (
      <svg viewBox="0 0 48 48" className={common} aria-hidden>
        <path d="M10 27c0-10 6-18 14-18s14 8 14 18" fill="none" stroke="url(#cyber)" strokeWidth="4" strokeLinecap="round" />
        <path d="M12 26h7v11h-7a4 4 0 0 1-4-4v-3a4 4 0 0 1 4-4Zm24 0h-7v11h7a4 4 0 0 0 4-4v-3a4 4 0 0 0-4-4Z" fill="#101018" stroke="#9d7cff" strokeWidth="2" />
        <path d="M21 37h6M15 31h3m12 0h3" stroke="#31ddff" strokeWidth="2" strokeLinecap="round" />
        <defs><linearGradient id="cyber" x1="8" x2="40" y1="11" y2="30"><stop stopColor="#8b00ff" /><stop offset="1" stopColor="#31ddff" /></linearGradient></defs>
      </svg>
    );
  }

  if (id === "fantasy-rpg") {
    return (
      <svg viewBox="0 0 48 48" className={common} aria-hidden>
        <path d="M24 4 34 18 24 44 14 18 24 4Z" fill="url(#rpg)" />
        <path d="M14 18h20M24 4v40M11 36l8-8M37 36l-8-8" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
        <path d="m24 15 4 6-4 6-4-6 4-6Z" fill="#08050d" opacity=".72" />
        <defs><linearGradient id="rpg" x1="14" x2="34" y1="5" y2="44"><stop stopColor="#ffe08a" /><stop offset=".5" stopColor="#c084fc" /><stop offset="1" stopColor="#8b00ff" /></linearGradient></defs>
      </svg>
    );
  }

  if (id === "anime-arena") {
    return (
      <svg viewBox="0 0 48 48" className={common} aria-hidden>
        <path d="M24 4 28 19l14-6-8 13 11 8-15 1-6 9-6-9-15-1 11-8-8-13 14 6 4-15Z" fill="url(#anime)" />
        <path d="M12 34 35 12M18 40l18-18" stroke="#08050d" strokeWidth="3" strokeLinecap="round" opacity=".72" />
        <path d="M13 34 35 12" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <defs><linearGradient id="anime" x1="5" x2="43" y1="6" y2="44"><stop stopColor="#ff7ad9" /><stop offset=".52" stopColor="#8b00ff" /><stop offset="1" stopColor="#ff8a3d" /></linearGradient></defs>
      </svg>
    );
  }

  if (id === "pixel-arcade") {
    return (
      <svg viewBox="0 0 48 48" className={common} aria-hidden>
        <path d="M10 11h28v26H10V11Z" fill="url(#pixel)" />
        <path d="M16 17h6v6h-6v-6Zm10 0h6v6h-6v-6ZM16 28h6v6h-6v-6Zm10 0h6v6h-6v-6Z" fill="#07040b" opacity=".78" />
        <path d="M8 6h9v5H8V6Zm23 31h9v5h-9v-5ZM5 21h5v9H5v-9Zm33-10h5v9h-5v-9Z" fill="#caff6a" />
        <defs><linearGradient id="pixel" x1="10" x2="38" y1="11" y2="37"><stop stopColor="#f472b6" /><stop offset=".55" stopColor="#8b00ff" /><stop offset="1" stopColor="#20d8ff" /></linearGradient></defs>
      </svg>
    );
  }

  if (id === "stealth-ops") {
    return (
      <svg viewBox="0 0 48 48" className={common} aria-hidden>
        <path d="M24 6 39 16 34 38H14L9 16 24 6Z" fill="url(#stealth)" />
        <path d="M16 24h16M18 31h12M24 13v25" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
        <defs><linearGradient id="stealth" x1="9" x2="39" y1="7" y2="40"><stop stopColor="#f4f4f5" /><stop offset=".25" stopColor="#71717a" /><stop offset="1" stopColor="#8b00ff" /></linearGradient></defs>
      </svg>
    );
  }

  if (id === "space-ranger") {
    return (
      <svg viewBox="0 0 48 48" className={common} aria-hidden>
        <circle cx="24" cy="24" r="17" fill="url(#space)" />
        <path d="M12 28c9-12 16-14 24-8M16 35c5-4 11-6 18-5" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="29" cy="17" r="3" fill="#fff" />
        <path d="M6 24h5m26 0h5M24 6v5M24 37v5" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
        <defs><linearGradient id="space" x1="8" x2="40" y1="8" y2="40"><stop stopColor="#2dd4bf" /><stop offset=".42" stopColor="#8b00ff" /><stop offset="1" stopColor="#312e81" /></linearGradient></defs>
      </svg>
    );
  }

  if (id === "racing-drift") {
    return (
      <svg viewBox="0 0 48 48" className={common} aria-hidden>
        <path d="M8 30 17 15h14l9 15-4 8H12l-4-8Z" fill="url(#racing)" />
        <path d="M15 28h18M18 21h12M14 36l4-5m16 5-4-5" stroke="#08050d" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M7 18h7M34 18h7" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
        <defs><linearGradient id="racing" x1="8" x2="40" y1="16" y2="39"><stop stopColor="#facc15" /><stop offset=".45" stopColor="#f97316" /><stop offset="1" stopColor="#8b00ff" /></linearGradient></defs>
      </svg>
    );
  }

  if (id === "wasteland-survivor") {
    return (
      <svg viewBox="0 0 48 48" className={common} aria-hidden>
        <path d="M24 6 38 18 34 38l-10 5-10-5-4-20L24 6Z" fill="url(#waste)" />
        <path d="M15 25h18M18 32h12M18 17l12 20M30 17 18 37" stroke="#08050d" strokeWidth="2.2" strokeLinecap="round" opacity=".7" />
        <path d="M12 18h24" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        <defs><linearGradient id="waste" x1="10" x2="38" y1="8" y2="43"><stop stopColor="#fde68a" /><stop offset=".48" stopColor="#a8a29e" /><stop offset="1" stopColor="#8b00ff" /></linearGradient></defs>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" className={common} aria-hidden>
      <path d="M24 5 34 15l8 2-6 8 1 12-13 6-13-6 1-12-6-8 8-2L24 5Z" fill="url(#myth)" />
      <path d="M16 25c4-7 12-7 16 0M18 33c3 3 9 3 12 0" stroke="#08050d" strokeWidth="2.4" strokeLinecap="round" opacity=".72" />
      <path d="M24 11v27M12 17l24 20M36 17 12 37" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" opacity=".9" />
      <defs><linearGradient id="myth" x1="7" x2="41" y1="6" y2="43"><stop stopColor="#f0abfc" /><stop offset=".45" stopColor="#8b00ff" /><stop offset="1" stopColor="#14b8a6" /></linearGradient></defs>
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

function loadImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image could not be loaded."));
    image.src = dataUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Image could not be prepared for generation."));
        }
      },
      "image/jpeg",
      0.92,
    );
  });
}

async function normalizeUploadImage(file: File) {
  const sourceDataUrl = await fileToDataUrl(file);
  const image = await loadImage(sourceDataUrl);
  const maxSize = 1536;
  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Image could not be prepared for generation.");
  }

  context.drawImage(image, 0, 0, width, height);

  const blob = await canvasToBlob(canvas);
  const normalizedFile = new File(
    [blob],
    file.name.replace(/\.[^.]+$/, "") + ".jpg",
    {
      type: "image/jpeg",
      lastModified: Date.now(),
    },
  );

  return {
    file: normalizedFile,
    dataUrl: canvas.toDataURL("image/jpeg", 0.92),
  };
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

function writeSessionHistory(generationHistory: GenerationRecord[]) {
  try {
    window.sessionStorage.setItem(
      "gaimin-avatar-history",
      JSON.stringify(
        generationHistory.map(
          ({ sourceImageDataUri: _sourceImageDataUri, ...generation }) => generation,
        ),
      ),
    );
  } catch (storageError) {
    console.warn("gaimin-avatar-history-persist-failed", storageError);
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

async function readJsonResponse(response: Response) {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text) as {
      message?: string;
      error?: string;
    };
  } catch {
    return {
      error: response.ok
        ? "Unexpected server response."
        : text.slice(0, 180) || `Request failed (${response.status}).`,
    };
  }
}

function GlassPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[18px] border border-white/[0.08] bg-white/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyleId>("cyber-esports");
  const variationCount = 2;
  const [viewMode, setViewMode] = useState<ViewMode>("create");
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
    () => avatarStyles.find((style) => style.id === selectedStyle) ?? avatarStyles[0],
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

    writeSessionHistory(generationHistory);
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

    try {
      const normalizedImage = await normalizeUploadImage(file);

      setSelectedFile(normalizedImage.file);
      setFileName(file.name);
      setPreviewUrl(normalizedImage.dataUrl);
      setSourceImageDataUri(normalizedImage.dataUrl);
      setResults([]);
      setError("");
      setShareStatus("");
      setUnlockStatus("");
      track("avatar_upload", {
        type: normalizedImage.file.type,
        originalType: file.type,
        size: normalizedImage.file.size,
        originalSize: file.size,
      });
    } catch {
      setError("This image format could not be prepared. Please try another photo.");
    }
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
    setViewMode("create");
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
    let shareUrl = `${window.location.origin}/share#${encodeSharePayload(payload)}`;

    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const share = (await response.json()) as { url?: string };

      if (response.ok && share.url) {
        shareUrl = `${window.location.origin}${share.url}`;
      }
    } catch {
      // Fall back to hash payload links when the short-link API is unavailable.
    }

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
      const payload = await readJsonResponse(response);

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

  const mainOutput = results[0]?.imageUrl ?? previewUrl;

  return (
    <main className="min-h-screen overflow-hidden bg-[#07070a] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,rgba(139,0,255,0.12)_0%,transparent_34%),linear-gradient(205deg,rgba(255,255,255,0.045)_0%,transparent_28%),linear-gradient(180deg,#101014_0%,#07070a_44%,#030304_100%)]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1360px] flex-col gap-3 px-3 py-3 sm:px-5 lg:px-6">
        <header className="flex items-center justify-between rounded-full border border-white/[0.08] bg-white/[0.045] px-3 py-2 backdrop-blur-2xl">
          <Link href="/" aria-label="Go to GAIMIN Avatar AI home">
            <img
              src="/gaimin-avatar-logo.svg"
              alt="GAIMIN Avatar AI"
              className="h-9 w-[128px] object-contain sm:h-10 sm:w-[142px]"
            />
          </Link>
          <button
            type="button"
            onClick={() => setViewMode("history")}
            className={cn(
              "flex h-10 items-center gap-1.5 rounded-full border border-white/[0.08] bg-black/25 px-3 text-xs font-semibold transition",
              viewMode === "history"
                ? "bg-white text-black"
                : "text-zinc-400 hover:text-white",
            )}
          >
            <History className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">History</span>
            {generationHistory.length > 0 && (
              <span className="text-[10px]">{generationHistory.length}</span>
            )}
          </button>
        </header>

        {viewMode === "create" ? (
          <div className="grid flex-1 gap-3 lg:grid-cols-[300px_minmax(0,1fr)_330px]">
            <GlassPanel className="order-2 flex max-h-none flex-col overflow-hidden lg:order-1 lg:max-h-[calc(100vh-86px)]">
              <div className="flex items-end justify-between gap-3 border-b border-white/[0.08] px-3 py-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c4b5fd]">
                    Style library
                  </p>
                  <h1 className="mt-1 text-lg font-semibold tracking-[-0.02em]">
                    Choose a lane
                  </h1>
                </div>
                <span className="rounded-full bg-white/[0.07] px-2 py-1 text-[11px] text-zinc-400">
                  12 styles
                </span>
              </div>

              <div className="grid gap-1.5 overflow-y-auto p-2 sm:grid-cols-2 lg:grid-cols-1">
                {avatarStyles.map((style) => {
                  const isSelected = selectedStyle === style.id;

                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style.id)}
                      className={cn(
                        "group flex min-h-[58px] items-center gap-2.5 rounded-[14px] border px-2.5 py-2 text-left transition",
                        isSelected
                          ? "border-[#8b00ff]/55 bg-[#8b00ff]/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                          : "border-transparent bg-white/[0.025] hover:border-white/[0.08] hover:bg-white/[0.05]",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-gradient-to-br",
                          style.accent,
                        )}
                      >
                        <StyleSigil id={style.id} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold tracking-[-0.01em] text-white">
                          {style.name}
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] text-zinc-500">
                          {styleMotifs[style.id]} · {style.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </GlassPanel>

            <GlassPanel className="order-1 flex min-h-[560px] flex-col overflow-hidden p-3 lg:order-2">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c4b5fd]">
                    GAIMIN Avatar AI
                  </p>
                  <h2 className="mt-2 max-w-lg text-[30px] font-semibold leading-[0.98] tracking-[-0.04em] text-zinc-50 sm:text-[42px]">
                    Refined avatars for your gaming identity.
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
                    Upload once, choose a style, generate two polished avatars.
                  </p>
                </div>
                <div className="hidden rounded-full border border-white/[0.08] bg-black/25 px-3 py-2 text-xs text-zinc-400 sm:block">
                  2 outputs · GAIMIN watermark
                </div>
              </div>

              <label
                htmlFor="avatar-upload"
                className="group relative mt-4 flex flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-[20px] border border-white/[0.08] bg-black/25 p-3 text-center transition hover:border-[#8b00ff]/50"
              >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(139,0,255,0.12),transparent_48%)]" />
                {mainOutput ? (
                  <img
                    src={mainOutput}
                    alt="Avatar preview"
                    className="relative aspect-square max-h-[430px] w-full max-w-[430px] rounded-[18px] object-cover shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                  />
                ) : (
                  <div className="relative flex max-w-sm flex-col items-center gap-3">
                    <div className="grid h-14 w-14 place-items-center rounded-[16px] border border-white/[0.08] bg-white/[0.06] text-[#d8b4fe]">
                      <ImagePlus className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-base font-semibold tracking-[-0.01em] text-white">
                        Upload selfie or avatar
                      </p>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                        PNG, JPG, or WEBP. Clear face framing gives best results.
                      </p>
                    </div>
                  </div>
                )}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => handleUpload(event.target.files?.[0])}
                />
              </label>

              <div className="mt-3 flex flex-col gap-2 rounded-[16px] border border-white/[0.08] bg-black/25 p-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 px-1">
                  <p className="truncate text-sm font-semibold">{activeStyle.name}</p>
                  <p className="truncate text-xs text-zinc-500">
                    {fileName || "Waiting for upload"} · 2 variations
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!selectedFile || isGenerating}
                  className="h-10 rounded-full px-4"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Generate
                </Button>
              </div>
              {error && (
                <p className="mt-2 rounded-[12px] border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs font-medium text-red-200">
                  {error}
                </p>
              )}
            </GlassPanel>

            <div className="order-3 flex flex-col gap-3">
              <GlassPanel className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Output
                    </p>
                    <h3 className="mt-1 text-base font-semibold">Generated set</h3>
                  </div>
                  {results.length > 0 && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={downloadAll} aria-label="Download all">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={shareAvatar} aria-label="Share">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {shareStatus && (
                  <p className="mt-2 rounded-[12px] border border-[#8b00ff]/20 bg-[#8b00ff]/10 px-3 py-2 text-xs font-medium text-[#d8b4fe]">
                    {shareStatus}
                  </p>
                )}

                <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
                  {results.length > 0
                    ? results.map((result, index) => (
                        <Card key={result.id} className="overflow-hidden rounded-[16px] bg-white/[0.035]">
                          <div className="relative">
                            <img
                              src={result.imageUrl}
                              alt={result.label}
                              className="aspect-square w-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-medium text-[#e9d5ff] backdrop-blur">
                              GAIMIN
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2 p-2">
                            <span className="text-xs text-zinc-400">
                              Variation {index + 1}
                            </span>
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
                      ))
                    : [1, 2].map((slot) => (
                        <div
                          key={slot}
                          className="aspect-square rounded-[16px] border border-white/[0.08] bg-white/[0.025]"
                        />
                      ))}
                </div>

                {results.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Button variant="secondary" size="sm" onClick={downloadGamerCard}>
                      <Trophy className="h-4 w-4" />
                      Card
                    </Button>
                    <Button variant="secondary" size="sm" onClick={shareAvatar}>
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                )}
              </GlassPanel>

              {results.length > 0 && (
                <GlassPanel className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#8b00ff]/15 text-[#d8b4fe]">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Want 4K HD versions?</h3>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                        Unlock HD upgrades and save this set with GAIMIN Launcher,
                        GGPL, and Club updates.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <div className="relative min-w-0 flex-1">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="email"
                        className="h-10 w-full rounded-full border border-white/[0.08] bg-black/25 py-2 pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-zinc-600 focus:border-[#8b00ff]/60"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={unlock4k}
                      disabled={isUnlocking4k}
                      className="rounded-full"
                    >
                      {isUnlocking4k ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Zap className="h-4 w-4" />
                      )}
                      4K
                    </Button>
                  </div>
                  {unlockStatus && (
                    <p className="mt-2 rounded-[12px] border border-[#8b00ff]/20 bg-[#8b00ff]/10 px-3 py-2 text-xs font-medium text-[#d8b4fe]">
                      {unlockStatus}
                    </p>
                  )}
                </GlassPanel>
              )}
            </div>
          </div>
        ) : (
          <div className="grid flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_330px]">
            <GlassPanel className="p-3">
              <div className="border-b border-white/[0.08] pb-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c4b5fd]">
                    Archive
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">
                    My generations
                  </h1>
                </div>
              </div>

              {generationHistory.length === 0 ? (
                <div className="flex min-h-[430px] items-center justify-center text-center">
                  <div className="max-w-xs">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/[0.06] text-[#d8b4fe]">
                      <History className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-base font-semibold">No saved session yet</h2>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      Generate a set and it will appear here until this browser
                      session ends.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  {generationHistory.map((generation) => (
                    <article
                      key={generation.id}
                      className={cn(
                        "overflow-hidden rounded-[16px] border bg-white/[0.035] transition",
                        selectedHistory?.id === generation.id
                          ? "border-[#8b00ff]/60"
                          : "border-white/[0.08] hover:border-white/[0.18]",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedHistoryId(generation.id)}
                        className="block w-full text-left"
                      >
                        <img
                          src={generation.images[0]?.imageUrl}
                          alt={`${generation.styleName} generation`}
                          className="aspect-square w-full object-cover"
                        />
                        <div className="p-2.5">
                          <h2 className="truncate text-xs font-semibold text-white">
                            {generation.styleName}
                          </h2>
                          <p className="mt-0.5 text-[11px] text-zinc-500">
                            {formatTimestamp(generation.createdAt)}
                          </p>
                        </div>
                      </button>
                      <div className="grid grid-cols-2 gap-1 border-t border-white/[0.08] p-2">
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
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </GlassPanel>

            <GlassPanel className="p-3">
              <h2 className="text-base font-semibold">Selected set</h2>
              <p className="mt-1 text-xs text-zinc-500">
                {selectedHistory
                  ? `${selectedHistory.styleName} · ${formatTimestamp(selectedHistory.createdAt)}`
                  : "Choose a generation to preview."}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
                {selectedHistory
                  ? selectedHistory.images.map((result, index) => (
                      <Card key={result.id} className="overflow-hidden rounded-[16px] bg-white/[0.035]">
                        <img
                          src={result.imageUrl}
                          alt={result.label}
                          className="aspect-square w-full object-cover"
                        />
                        <div className="flex items-center justify-between p-2">
                          <span className="text-xs text-zinc-400">
                            Variation {index + 1}
                          </span>
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
                    ))
                  : [1, 2].map((slot) => (
                      <div
                        key={slot}
                        className="aspect-square rounded-[16px] border border-white/[0.08] bg-white/[0.025]"
                      />
                    ))}
              </div>
            </GlassPanel>
          </div>
        )}
      </section>
    </main>
  );
}
