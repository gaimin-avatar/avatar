import type { GeneratedAvatar } from "@/types/avatar";

type XaiImageResponse = {
  data?: Array<{
    url?: string;
    b64_json?: string;
  }>;
  url?: string;
  error?: {
    message?: string;
  };
};

function getContentType(file: File) {
  return file.type || "image/png";
}

async function fileToDataUri(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${getContentType(file)};base64,${buffer.toString("base64")}`;
}

function extractImageUrl(payload: XaiImageResponse) {
  const firstImage = payload.data?.[0];

  if (firstImage?.url) return firstImage.url;
  if (firstImage?.b64_json) {
    return `data:image/png;base64,${firstImage.b64_json}`;
  }
  if (payload.url) return payload.url;

  return "";
}

export async function generateWithXai({
  image,
  prompt,
  styleId,
  variations,
}: {
  image: File;
  prompt: string;
  styleId: string;
  variations: number;
}): Promise<GeneratedAvatar[]> {
  const apiKey = process.env.XAI_API_KEY;

  if (!apiKey) {
    throw new Error("XAI_API_KEY is not configured.");
  }

  const imageDataUri = await fileToDataUri(image);

  const requests = Array.from({ length: variations }, async (_, index) => {
    const response = await fetch("https://api.x.ai/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.XAI_IMAGE_MODEL ?? "grok-imagine-image-quality",
        prompt: `${prompt} Variation ${index + 1}: create a distinct composition, lighting setup, and outfit detail while preserving the same person.`,
        image: {
          type: "image_url",
          url: imageDataUri,
        },
        response_format: "url",
      }),
    });

    const payload = (await response.json()) as XaiImageResponse;

    if (!response.ok) {
      throw new Error(
        payload.error?.message ?? `xAI image generation failed (${response.status}).`,
      );
    }

    const imageUrl = extractImageUrl(payload);

    if (!imageUrl) {
      throw new Error("xAI did not return an image URL.");
    }

    return {
      id: `${styleId}-${index + 1}`,
      label: `Variation ${index + 1}`,
      imageUrl,
      provider: "xai",
    };
  });

  return Promise.all(requests);
}
