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
  | "wasteland-survivor";

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
