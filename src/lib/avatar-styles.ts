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
  {
    id: "stealth-ops",
    name: "Stealth Ops Phantom",
    description: "matte tactical noir, silent elite energy",
    accent: "from-zinc-200 to-[#8b00ff]",
  },
  {
    id: "space-ranger",
    name: "Galactic Space Ranger",
    description: "deep-space explorer with cosmic armor",
    accent: "from-[#8b00ff] to-indigo-300",
  },
  {
    id: "racing-drift",
    name: "Racing Drift King",
    description: "velocity, sponsor lights, street prestige",
    accent: "from-[#8b00ff] to-amber-300",
  },
  {
    id: "sports-mvp",
    name: "Sports Sim MVP",
    description: "stadium hero, trophy-night confidence",
    accent: "from-emerald-300 to-[#8b00ff]",
  },
  {
    id: "wasteland-survivor",
    name: "Wasteland Survivor",
    description: "post-apocalyptic grit, cinematic resilience",
    accent: "from-stone-300 to-[#8b00ff]",
  },
  {
    id: "mythic-tamer",
    name: "Mythic Creature Tamer",
    description: "legendary companion, enchanted bond",
    accent: "from-fuchsia-300 to-[#8b00ff]",
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
