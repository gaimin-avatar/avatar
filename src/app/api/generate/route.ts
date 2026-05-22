import { NextRequest, NextResponse } from "next/server";

import { isAvatarStyleId } from "@/lib/avatar-styles";
import { getStylePrompt } from "@/lib/style-prompts";
import { generateWithXai } from "@/lib/xai";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");
    const style = String(formData.get("style") ?? "");
    const requestedVariations = Number(formData.get("variations") ?? 1);
    const variations = Math.min(Math.max(requestedVariations || 1, 1), 4);

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "Image file is required." },
        { status: 400 },
      );
    }

    if (!isAvatarStyleId(style)) {
      return NextResponse.json(
        { error: "Valid style is required." },
        { status: 400 },
      );
    }

    if (image.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be 8MB or smaller." },
        { status: 400 },
      );
    }

    const prompt = getStylePrompt(style);
    const images = await generateWithXai({
      image,
      prompt,
      styleId: style,
      variations,
    });

    return NextResponse.json({
      success: true,
      provider: "xai",
      images,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Image generation failed.";
    const status = message.includes("XAI_API_KEY") ? 503 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
