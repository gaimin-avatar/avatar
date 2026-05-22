import { fileToDataUri } from "@/lib/ai/files";
import { googleImageProvider } from "@/lib/ai/google";
import type { AvatarGenerationRequest } from "@/lib/ai/types";

const avatarImageProvider = googleImageProvider;

export async function generateAvatarImagesFromFile({
  image,
  ...request
}: Omit<AvatarGenerationRequest, "imageDataUri"> & {
  image: File;
}) {
  const imageDataUri = await fileToDataUri(image);

  return avatarImageProvider.generateAvatarImages({
    ...request,
    imageDataUri,
  });
}

export async function generateAvatarImagesFromDataUri(
  request: AvatarGenerationRequest,
) {
  return avatarImageProvider.generateAvatarImages(request);
}

export function getAvatarImageProviderId() {
  return avatarImageProvider.id;
}

