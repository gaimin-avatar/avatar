import type { AvatarStyle, AvatarStyleId } from "@/types/avatar";

export const avatarStyles: AvatarStyle[] = [
  {
    id: "battle-royale",
    name: "Battle Royale Hero",
    description: "cinematic squad-leader energy",
    accent: "from-[#8b00ff] to-red-500",
  },
  {
    id: "block-world",
    name: "Block World Adventurer",
    description: "chunky explorer, bright loot colors",
    accent: "from-[#8b00ff] to-sky-400",
  },
  {
    id: "cyber-esports",
    name: "Cyber Esports Pro",
    description: "neon jersey, arena lighting",
    accent: "from-cyan-300 to-[#8b00ff]",
  },
  {
    id: "fantasy-rpg",
    name: "Fantasy RPG Champion",
    description: "legendary armor and guild prestige",
    accent: "from-[#8b00ff] to-violet-300",
  },
  {
    id: "anime-arena",
    name: "Anime Arena Fighter",
    description: "bold linework and power aura",
    accent: "from-rose-300 to-[#8b00ff]",
  },
  {
    id: "pixel-arcade",
    name: "Pixel Arcade Legend",
    description: "retro icon with high-score swagger",
    accent: "from-[#8b00ff] to-orange-400",
  },
];

export const styleNamesById = avatarStyles.reduce(
  (styles, style) => ({
    ...styles,
    [style.id]: style.name,
  }),
  {} as Record<AvatarStyleId, string>,
);

export const validStyleIds = new Set<AvatarStyleId>(
  avatarStyles.map((style) => style.id),
);

export function isAvatarStyleId(style: string): style is AvatarStyleId {
  return validStyleIds.has(style as AvatarStyleId);
}
