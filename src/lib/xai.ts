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

async function parseXaiImageResponse(response: Response) {
  const text = await response.text();

  if (!text) return {} as XaiImageResponse;

  try {
    return JSON.parse(text) as XaiImageResponse;
  } catch {
    const clippedText = text.slice(0, 220);
    throw new Error(
      response.ok
        ? "xAI returned an unreadable image response."
        : `xAI image generation failed (${response.status}): ${clippedText}`,
    );
  }
}

function getContentType(file: File) {
  return file.type || "image/png";
}

export async function fileToDataUri(file: File) {
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
  const imageDataUri = await fileToDataUri(image);

  return generateWithXaiDataUri({
    imageDataUri,
    prompt,
    styleId,
    variations,
  });
}

export async function generateWithXaiDataUri({
  imageDataUri,
  prompt,
  styleId,
  variations,
  qualityMode = "free",
}: {
  imageDataUri: string;
  prompt: string;
  styleId: string;
  variations: number;
  qualityMode?: "free" | "hd";
}): Promise<GeneratedAvatar[]> {
  const apiKey = process.env.XAI_API_KEY;

  if (!apiKey) {
    throw new Error("XAI_API_KEY is not configured.");
  }

  const model =
    qualityMode === "hd"
      ? process.env.XAI_IMAGE_MODEL_HD ??
        process.env.XAI_IMAGE_MODEL ??
        "grok-imagine-image-quality"
      : process.env.XAI_IMAGE_MODEL ?? "grok-imagine-image-quality";
  const resolution =
    qualityMode === "hd"
      ? process.env.XAI_IMAGE_RESOLUTION_HD ?? "2K"
      : process.env.XAI_IMAGE_RESOLUTION_FREE;

  const requests = Array.from({ length: variations }, async (_, index) => {
    const body: Record<string, unknown> = {
      model,
      prompt:
        qualityMode === "hd"
          ? `${prompt} Premium 4K HD avatar upgrade: maximize sharpness, texture fidelity, clean facial detail, refined lighting, and high-end game key art polish. Variation ${index + 1}: preserve the same person while improving production quality.`
          : `${prompt} Variation ${index + 1}: create a distinct composition, lighting setup, and outfit detail while preserving the same person.`,
      image: {
        type: "image_url",
        url: imageDataUri,
      },
      response_format: "url",
    };

    if (resolution) {
      body.resolution = resolution;
    }

    const response = await fetch("https://api.x.ai/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const payload = await parseXaiImageResponse(response);

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
      label: qualityMode === "hd" ? `4K HD Variation ${index + 1}` : `Variation ${index + 1}`,
      imageUrl,
      provider: "xai",
    };
  });

  return Promise.all(requests);
}
