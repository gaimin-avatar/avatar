import type { GeneratedAvatar } from "@/types/avatar";

export type SharePayload = {
  styleName: string;
  createdAt: string;
  images: Pick<GeneratedAvatar, "imageUrl" | "label">[];
};

const globalShareStore = globalThis as typeof globalThis & {
  gaiminAvatarShares?: Map<string, SharePayload>;
};

export const shareStore =
  globalShareStore.gaiminAvatarShares ?? new Map<string, SharePayload>();

globalShareStore.gaiminAvatarShares = shareStore;

export function createShareId() {
  return crypto.randomUUID().replaceAll("-", "").slice(0, 8);
}
