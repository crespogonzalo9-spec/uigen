# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest unit tests (jsdom environment)
npm run setup        # Install deps + generate Prisma client + run migrations
npm run db:reset     # Reset SQLite database
```

Run a single test file:
```bash
npx vitest run src/path/to/file.test.ts
```

## Environment

Set `ANTHROPIC_API_KEY` in `.env` to use Claude Haiku 4.5. Without it, the app falls back to a mock provider that returns static code.

## Architecture

**UIGen** is a Next.js 15 App Router application where users describe React components in a chat interface and Claude AI generates/edits the component code in real time.

### Request Flow

1. User sends a message → `POST /api/chat` (`src/app/api/chat/route.ts`)
2. The route streams a response from Claude via Vercel AI SDK, with two tools available: `str_replace_editor` and `file_manager`
3. Tool calls are executed client-side in the chat context (`src/lib/contexts/chat-context.tsx`) via `onToolCall`, which mutates the **virtual file system**
4. Changes to the virtual FS trigger re-renders in the preview frame

### Virtual File System

`src/lib/file-system.ts` — an in-memory class (`VirtualFileSystem`) that holds all component files. No files are written to disk. State is managed globally via `src/lib/contexts/file-system-context.tsx`.

### Live Preview

`src/components/preview/PreviewFrame.tsx` renders an iframe. When the active file changes, `src/lib/transform/jsx-transformer.ts` uses **Babel standalone** to transpile JSX to JS, generates an import map pointing to esm.sh CDN for React/external packages, and injects this into the iframe as a full HTML document.

### AI Tools

- `str_replace_editor` (`src/lib/tools/str-replace.ts`): create, view, str_replace, insert operations on virtual files
- `file_manager` (`src/lib/tools/file-manager.ts`): rename and delete files/directories

The system prompt is in `src/lib/prompts/`.

### Auth & Persistence

- JWT sessions via `jose`, passwords hashed with `bcrypt`, session cookie managed in `src/lib/auth.ts`
- `src/middleware.ts` protects `/api/` routes (except `/api/chat`) requiring a valid session cookie
- Prisma + SQLite (`prisma/dev.db`): `User` and `Project` models. Projects store messages and file system state as JSON blobs. Anonymous users get no persistence.

### Provider Abstraction

`src/lib/provider.ts` exports a single provider object. When `ANTHROPIC_API_KEY` is set it returns a real Anthropic provider (Claude Haiku 4.5); otherwise returns a mock that streams static fixture code.

### UI Layout

`src/app/main-content.tsx` uses `react-resizable-panels` to split the screen into: **Chat** (left) | **Preview** (top-right) | **Code Editor + File Tree** (bottom-right). Components live under `src/components/{chat,editor,preview,ui}`. UI primitives use Radix UI wrapped via shadcn/ui (New York style, Tailwind CSS v4).

### Path Aliases

`@/*` maps to `src/*` (configured in `tsconfig.json`).
