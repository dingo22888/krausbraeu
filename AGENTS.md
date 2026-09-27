# KrausBräu

Next.js App Router application, Node 24, Neon Postgres. This project does NOT use the krs-game Supabase project. All schema changes belong in this repository's migrations and migration runner.

- Never commit SQLite source files, credentials, or .env files.
- Only selected public facts from Sud 31 are in the initial seed. All other data must be imported privately.
- Import updates `brew` only. Preserve editorial fields, publication flags, and permanent public numbers.
- Public pages must filter on published=true. Every admin mutation and private preview requires verified admin auth.
- The sole authorized GitHub account is ID 5803616, not any merely authenticated GitHub user.
- Never use client-side database credentials. Never print secret environment values.
- Keep migrations additive, versioned, and transactional. Review and test before applying.
- npm test, npm run typecheck, npm run build. Build applies additive migrations only when a Neon connection is present.
- LOCAL_PREVIEW=1 works only in local development; it uses the real, sanitized Sud 31 fixture for visual checks.
- User logo: public/krausbraeu-logo.png already says Gebraut in Struthütten. Do not use the older Salchendorf logo.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

- Import selections use source_id, never Sudnummer. Unchecked IDs are remembered in beer_import_exclusions. Deletion excludes the source ID before removing the website record.
- Bulk publication must be atomic, preserve assigned URLs, and reject missing/duplicate/conflicting numbers without partial updates.
- Editorial migration version 3 only fills existing records; never changes publication status or imports Kevin. Preserve existing custom descriptions, images and non-default accents.
