import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
  } | null;
  const email = body?.email?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }

  // Temporary capture hook. Wire this to GAIMIN CRM, Resend, HubSpot, or a DB.
  console.info("gaimin-avatar-email-capture", { email, capturedAt: new Date().toISOString() });

  return NextResponse.json({ success: true });
}
