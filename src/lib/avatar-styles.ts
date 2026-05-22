import type { AvatarStyle, AvatarStyleId } from "@/types/avatar";

export const avatarStyles: AvatarStyle[] = [
  {
    id: "battle-royale",
    name: "Battle Royale Hero",
    description: "cinematic squad-leader energy",
    accent: "from-amber-300 to-red-500",
  },
  {
    id: "block-world",
    name: "Block World Adventurer",
    description: "chunky explorer, bright loot colors",
    accent: "from-emerald-300 to-sky-400",
  },
  {
    id: "cyber-esports",
    name: "Cyber Esports Pro",
    description: "neon jersey, arena lighting",
    accent: "from-cyan-300 to-fuchsia-500",
  },
  {
    id: "fantasy-rpg",
    name: "Fantasy RPG Champion",
    description: "legendary armor and guild prestige",
    accent: "from-violet-300 to-yellow-300",
  },
  {
    id: "anime-arena",
    name: "Anime Arena Fighter",
    description: "bold linework and power aura",
    accent: "from-rose-300 to-indigo-400",
  },
  {
    id: "pixel-arcade",
    name: "Pixel Arcade Legend",
    description: "retro icon with high-score swagger",
    accent: "from-lime-300 to-orange-400",
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
