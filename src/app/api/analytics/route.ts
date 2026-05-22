import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const event = (await request.json().catch(() => null)) as {
    name?: string;
    data?: Record<string, unknown>;
  } | null;

  if (!event?.name) {
    return NextResponse.json({ error: "Event name is required." }, { status: 400 });
  }

  // Minimal server-side event hook. Replace with GA4, Plausible, PostHog, or GAIMIN analytics.
  console.info("gaimin-avatar-analytics", {
    name: event.name,
    data: event.data ?? {},
    trackedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
