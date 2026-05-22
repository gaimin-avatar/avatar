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
    "Preserve the person's recognizable facial identity, expression, age range, skin tone, and face shape.",
    "Keep it suitable for a public gaming profile picture.",
    "No text, no logos, no extra watermarks inside the generated image.",
  ].join(" ");
}
