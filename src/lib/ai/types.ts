import type { GeneratedAvatar } from "@/types/avatar";

export type ImageQualityMode = "free" | "hd";

export type AvatarGenerationRequest = {
  imageDataUri: string;
  prompt: string;
  styleId: string;
  variations: number;
  qualityMode?: ImageQualityMode;
};

export type AvatarImageProvider = {
  id: string;
  generateAvatarImages(
    request: AvatarGenerationRequest,
  ): Promise<GeneratedAvatar[]>;
};

