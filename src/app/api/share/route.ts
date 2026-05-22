import { NextRequest, NextResponse } from "next/server";

import { createShareId, shareStore, type SharePayload } from "@/lib/share-store";

function isValidPayload(payload: SharePayload | null): payload is SharePayload {
  return Boolean(
    payload?.styleName &&
      payload.createdAt &&
      Array.isArray(payload.images) &&
      payload.images.length > 0 &&
      payload.images.every((image) => image.imageUrl && image.label),
  );
}

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => null)) as SharePayload | null;

  if (!isValidPayload(payload)) {
    return NextResponse.json(
      { error: "Valid share payload is required." },
      { status: 400 },
    );
  }

  const id = createShareId();
  shareStore.set(id, payload);

  return NextResponse.json({ id, url: `/share/${id}` });
}
