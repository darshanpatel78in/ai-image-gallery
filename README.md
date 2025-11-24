# AI Image Gallery

AI-powered image gallery built with Next.js 14, Supabase, and Google Cloud Vision.

## Stack

- Next.js 14 (App Router)
- React + TypeScript
- Tailwind CSS
- Supabase (Auth, Postgres, Storage)
- Google Cloud Vision API

## Features

- Email/password auth via Supabase
- Image upload to Supabase Storage
- Background AI processing via Google Vision:
  - Tags (5–10)
  - Description
  - Top 3 colors (hex)
- Smart search:
  - Text search over description/tags
  - Color filter
  - "Find similar" based on tags + colors
- Per-user isolation via RLS

## Setup

1. Install deps:

```bash
npm install
```

2. Create `.env.local` based on `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
VISION_CREDENTIALS_JSON=
```

3. In Supabase:

- Create `images` and `image_metadata` tables as in `ai-gallery-planning.md`.
- Enable RLS and add policies from the planning doc.
- Create a `user-images` storage bucket.

4. In Google Cloud:

- Enable the Vision API.
- Create a service account with Vision permissions.
- Download the JSON key and paste its contents into `VISION_CREDENTIALS_JSON`.

## Development

Run the dev server:

```bash
npm run dev
```

Then open `http://localhost:3000/gallery`.

## Testing

Basic unit tests use Vitest:

```bash
npm run test
```

Covered:

- `rgbToHex`
- similarity helpers
- description generation

## Future Improvements

- Editable tags
- Image delete
- Dark/light theme toggle
- Image download
- Vector search for semantic similarity
