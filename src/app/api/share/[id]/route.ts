import { NextResponse } from "next/server";

import { shareStore } from "@/lib/share-store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const payload = shareStore.get(id);

  if (!payload) {
    return NextResponse.json({ error: "Share not found." }, { status: 404 });
  }

  return NextResponse.json({ payload });
}
