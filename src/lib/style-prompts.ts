import prompts from "../../prompts/styles.json";

import { styleNamesById } from "@/lib/avatar-styles";
import type { AvatarStyleId } from "@/types/avatar";

type StylePromptsFile = {
  styles: Record<string, string>;
};

const stylePrompts = prompts as StylePromptsFile;

export function getStylePrompt(styleId: AvatarStyleId) {
  const styleName = styleNamesById[styleId];
  const prompt = stylePrompts.styles[styleName];

  if (!prompt) {
    throw new Error(`Missing prompt for ${styleName}`);
  }

  return [
    prompt,
    "Use the uploaded selfie only as identity reference: keep a recognizable likeness, approximate age range, skin tone, face shape, and key features.",
    "Do not copy, paste, or leave the original photographic face unchanged; redraw the face and body completely in the requested game art style.",
    "Make the result feel like a finished game avatar/profile picture, not a costume edit.",
    "No text, no logos, no extra watermarks inside the generated image.",
  ].join(" ");
}
