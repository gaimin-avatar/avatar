export type AvatarStyleId =
  | "battle-royale"
  | "block-world"
  | "cyber-esports"
  | "fantasy-rpg"
  | "anime-arena"
  | "pixel-arcade"
  | "stealth-ops"
  | "space-ranger"
  | "racing-drift"
  | "sports-mvp"
  | "wasteland-survivor"
  | "mythic-tamer";

export type AvatarStyle = {
  id: AvatarStyleId;
  name: string;
  description: string;
  accent: string;
};

export type GeneratedAvatar = {
  id: string;
  label: string;
  imageUrl: string;
  provider?: string;
};
