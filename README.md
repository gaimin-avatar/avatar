# GAIMIN Avatar AI

Browser-based avatar generator for `avatar.gaimin.gg`.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- shadcn-style local UI primitives
- xAI Grok Imagine image editing via `/api/generate`

## MVP Flow

1. Upload a selfie, avatar, or profile picture.
2. Pick one of six game-inspired styles.
3. Choose 1-4 variations.
4. Generate branded AI outputs.
5. Download individual images, all images, or a Gamer Card.

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
XAI_API_KEY=your_xai_key
XAI_IMAGE_MODEL=grok-imagine-image-quality
```

`/api/generate` uses Grok Imagine image editing with the uploaded image encoded as a base64 data URI.

## Deployment

Recommended target: Vercel.

Required production env vars:

- `XAI_API_KEY`
- `XAI_IMAGE_MODEL` optional, defaults to `grok-imagine-image-quality`

## Development

```bash
npm install
npm run dev
```
