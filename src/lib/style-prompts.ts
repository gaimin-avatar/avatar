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
    "Identity lock is critical: the output must clearly look like the uploaded person at first glance.",
    "Preserve the person's face shape, jawline, forehead, eye shape and spacing, eyebrow shape, nose bridge and nose tip, mouth shape, lip proportions, cheeks, skin tone, age range, facial hair if present, glasses if present, and overall expression.",
    "Do not invent a different face, different ethnicity, different age, different nose, different mouth, or different eye spacing.",
    "Render those same facial features through the chosen game art style so it feels like the person became that character, not a random character.",
    "No text, no logos, no extra watermarks inside the generated image.",
  ].join(" ");
}
