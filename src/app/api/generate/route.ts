import { NextRequest, NextResponse } from "next/server";

const validStyles = new Set([
  "battle-royale",
  "block-world",
  "cyber-esports",
  "fantasy-rpg",
  "anime-arena",
  "pixel-arcade",
]);

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get("image");
  const style = String(formData.get("style") ?? "");
  const requestedVariations = Number(formData.get("variations") ?? 1);
  const variations = Math.min(Math.max(requestedVariations || 1, 1), 4);

  if (!(image instanceof File)) {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 });
  }

  if (!validStyles.has(style)) {
    return NextResponse.json({ error: "Valid style is required." }, { status: 400 });
  }

  const images = Array.from({ length: variations }, (_, index) => ({
    id: `${style}-${index + 1}`,
    label: `Variation ${index + 1}`,
    imageUrl: `https://picsum.photos/seed/gaimin-${style}-${index + 1}/1024/1024`,
  }));

  return NextResponse.json({
    success: true,
    images,
  });
}
