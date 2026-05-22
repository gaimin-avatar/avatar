import { NextRequest, NextResponse } from "next/server";

import { isAvatarStyleId, styleNamesById } from "@/lib/avatar-styles";
import { getStylePrompt } from "@/lib/style-prompts";
import { generateWithXaiDataUri } from "@/lib/xai";
import type { GeneratedAvatar } from "@/types/avatar";

export const maxDuration = 60;

type UnlockRequest = {
  email?: string;
  styleId?: string;
  sourceImageDataUri?: string;
  variations?: number;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendUnlockEmail({
  email,
  styleName,
  images,
}: {
  email: string;
  styleName: string;
  images: GeneratedAvatar[];
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.UNLOCK_EMAIL_FROM;

  if (!apiKey || !from) {
    console.info("gaimin-avatar-4k-unlock-email-pending", {
      email,
      styleName,
      imageUrls: images.map((image) => image.imageUrl),
      capturedAt: new Date().toISOString(),
      note: "Configure RESEND_API_KEY and UNLOCK_EMAIL_FROM to send email.",
    });

    return { sent: false };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: `Your GAIMIN Avatar AI 4K HD ${styleName} avatars are ready`,
      html: `
        <div style="background:#050408;color:#ffffff;font-family:Arial,Helvetica,sans-serif;padding:32px">
          <h1 style="margin:0 0 12px;color:#ffffff">Your 4K HD avatars are ready</h1>
          <p style="color:#d4d4d8">Made with GAIMIN Avatar AI. Download your ${styleName} upgrades below.</p>
          <div style="display:grid;gap:16px;margin:24px 0">
            ${images
              .map(
                (image, index) => `
                  <a href="${image.imageUrl}" style="display:block;color:#c084fc;font-weight:700">
                    Download 4K HD variation ${index + 1}
                  </a>
                `,
              )
              .join("")}
          </div>
          <p style="color:#d4d4d8">Next level starts with GAIMIN Launcher, GGPL, and Club.</p>
          <a href="https://avatar.gaimin.gg" style="display:inline-block;background:#8b00ff;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700">
            Create another avatar
          </a>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Email delivery failed: ${error}`);
  }

  return { sent: true };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as UnlockRequest | null;
    const email = body?.email?.trim().toLowerCase() ?? "";
    const styleId = body?.styleId ?? "";
    const sourceImageDataUri = body?.sourceImageDataUri ?? "";
    const variations = Math.min(Math.max(Number(body?.variations) || 2, 1), 2);

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 },
      );
    }

    if (!isAvatarStyleId(styleId)) {
      return NextResponse.json(
        { error: "Valid style is required." },
        { status: 400 },
      );
    }

    if (!sourceImageDataUri.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Original image is required for 4K unlock." },
        { status: 400 },
      );
    }

    const prompt = getStylePrompt(styleId);
    const images = await generateWithXaiDataUri({
      imageDataUri: sourceImageDataUri,
      prompt,
      styleId,
      variations,
      qualityMode: "hd",
    });

    const styleName = styleNamesById[styleId];
    const emailResult = await sendUnlockEmail({ email, styleName, images });

    return NextResponse.json({
      success: true,
      emailSent: emailResult.sent,
      images,
      message: emailResult.sent
        ? "Check your email for your 4K HD avatar downloads."
        : "4K HD avatars generated. Email delivery is pending provider setup.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "4K unlock failed.";
    const status = message.includes("XAI_API_KEY") ? 503 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
