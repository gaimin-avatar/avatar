import { parseDataUri } from "@/lib/ai/files";
import type { AvatarGenerationRequest, AvatarImageProvider } from "@/lib/ai/types";
import type { GeneratedAvatar } from "@/types/avatar";

type GoogleImagePart = {
  inlineData?: {
    mimeType?: string;
    data?: string;
  };
  inline_data?: {
    mime_type?: string;
    data?: string;
  };
  text?: string;
};

type GoogleGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: GoogleImagePart[];
    };
  }>;
  error?: {
    message?: string;
  };
};

async function parseGoogleResponse(response: Response) {
  const text = await response.text();

  if (!text) return {} as GoogleGenerateContentResponse;

  try {
    return JSON.parse(text) as GoogleGenerateContentResponse;
  } catch {
    const clippedText = text.slice(0, 220);
    throw new Error(
      response.ok
        ? "Google image API returned an unreadable response."
        : `Google image API failed (${response.status}): ${clippedText}`,
    );
  }
}

function extractGeneratedImage(payload: GoogleGenerateContentResponse) {
  const parts = payload.candidates?.flatMap(
    (candidate) => candidate.content?.parts ?? [],
  );
  const imagePart = parts?.find((part) => part.inlineData || part.inline_data);
  const inlineData = imagePart?.inlineData;
  const inlineDataSnakeCase = imagePart?.inline_data;
  const mimeType =
    inlineData?.mimeType ?? inlineDataSnakeCase?.mime_type ?? "image/png";
  const base64Data = inlineData?.data ?? inlineDataSnakeCase?.data;

  if (!base64Data) return "";

  return `data:${mimeType};base64,${base64Data}`;
}

function getGooglePrompt({
  prompt,
  qualityMode,
  variation,
}: {
  prompt: string;
  qualityMode: "free" | "hd";
  variation: number;
}) {
  const baseInstruction =
    "Use the uploaded image only as an identity reference, not as a layer to paste onto the result. Create a new square game avatar from scratch. Keep a recognizable likeness through broad facial structure, skin tone, age range, and key features, but fully redraw the face, hair, body, outfit, lighting, and background in the requested style. Avoid photoreal selfie face, face-swap look, pasted head, unchanged glasses glare, mismatched head/body lighting, or costume-only edits. Return only the finished square avatar image.";

  if (qualityMode === "hd") {
    return `${baseInstruction} ${prompt} Premium HD avatar upgrade: maximize sharpness, texture fidelity, clean stylized facial detail, refined lighting, and high-end game key art polish. Variation ${variation}: make a distinct composition while keeping the same recognizable character identity.`;
  }

  return `${baseInstruction} ${prompt} Variation ${variation}: make a distinct avatar composition, expression, lighting setup, and outfit detail while keeping the same recognizable character identity.`;
}

export const googleImageProvider: AvatarImageProvider = {
  id: "google",

  async generateAvatarImages({
    imageDataUri,
    prompt,
    styleId,
    variations,
    qualityMode = "free",
  }: AvatarGenerationRequest): Promise<GeneratedAvatar[]> {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY is not configured.");
    }

    const model =
      qualityMode === "hd"
        ? process.env.GOOGLE_IMAGE_MODEL_HD ??
          process.env.GOOGLE_IMAGE_MODEL ??
          "gemini-2.5-flash-image"
        : process.env.GOOGLE_IMAGE_MODEL ?? "gemini-2.5-flash-image";
    const { mimeType, base64Data } = parseDataUri(imageDataUri);

    const requests = Array.from({ length: variations }, async (_, index) => {
      const body: Record<string, unknown> = {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: getGooglePrompt({
                  prompt,
                  qualityMode,
                  variation: index + 1,
                }),
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["IMAGE"],
        },
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify(body),
        },
      );
      const payload = await parseGoogleResponse(response);

      if (!response.ok) {
        throw new Error(
          payload.error?.message ??
            `Google image API failed (${response.status}).`,
        );
      }

      const imageUrl = extractGeneratedImage(payload);

      if (!imageUrl) {
        throw new Error("Google image API did not return an image.");
      }

      return {
        id: `${styleId}-${index + 1}`,
        label:
          qualityMode === "hd"
            ? `4K HD Variation ${index + 1}`
            : `Variation ${index + 1}`,
        imageUrl,
        provider: "google",
      };
    });

    return Promise.all(requests);
  },
};
