# QuickWebStack — AI Website Generator

A Lovable-clone website generator where users describe any website in plain language and an AI instantly generates a complete, working HTML page with a live preview in a split-view workspace.

## Architecture

- **Framework**: React + Vite (frontend) + Express (backend)
- **Routing**: react-router-dom
- **Styling**: Tailwind CSS with custom dark monochrome theme (black bg, white text, JetBrains Mono + Space Grotesk fonts, sharp corners)
- **Port**: 5000

## Key Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/pages/Index.tsx` | Marketing home page |
| `/generate` | `src/pages/Generate.tsx` | Lovable-style prompt input — big headline, textarea, example chips |
| `/workspace` | `src/pages/Workspace.tsx` | Split view: chat panel (left) + live iframe preview (right) |

## Code Generator

`src/utils/codeGenerator.ts` — `generateWebsite(prompt: string): string`

Smart template engine that detects intent from the prompt and outputs rich, fully self-contained HTML+CSS+JS. Supported templates:
- SaaS landing page
- Developer portfolio
- Analytics dashboard  
- E-commerce store
- Restaurant / fine dining
- Blog / magazine
- Pricing page
- Generic beautiful fallback

## User Flow

1. User visits `/generate` → sees big "What do you want to build?" prompt
2. User types description → clicks "Build it" (or presses Enter)
3. Navigate to `/workspace` with `{ id, prompt, code, timestamp }` in router state
4. Workspace shows: left panel = AI chat, right panel = live iframe preview
5. User can chat to refine → AI regenerates code instantly
6. User can toggle Preview ↔ Code, Desktop ↔ Mobile, Copy, Export

## Design Rules

- Dark monochrome theme: pure black background, pure white text
- No color accents except monochrome
- JetBrains Mono for all body/UI text
- Space Grotesk for headings (`font-display`)
- Sharp corners everywhere (`border-radius: 0`)
- No AI model names, no language selectors exposed to users
- Everything auto-generates HTML
