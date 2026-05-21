import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "AI provider is not configured yet.",
      nextStep:
        "Wire this route to Grok Imagine, Flux, Replicate, or Leonardo once prompt templates are finalized.",
    },
    { status: 501 },
  );
}
