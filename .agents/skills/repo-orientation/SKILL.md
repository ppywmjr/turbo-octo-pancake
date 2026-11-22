---
name: repo-orientation
display-name: Repo Orientation
description: Orientation for this Next.js frontend (turbo-octo-pancake): layout, commands, component rules. Read when starting work here or unsure where code lives.
---

This repo is the Next.js frontend + BFF for the video subscription service. It talks to the Express backend (sibling repo `reimagined-garbanzo`) only through server-side BFF routes, never directly from the browser.

## Stack

- Next.js 16 (App Router), React 19, TypeScript, Tailwind 4, Clerk (`@clerk/nextjs`), Zod
- Vitest + React Testing Library (jsdom), Stryker mutation testing; pnpm, Node 24
- Dev server: port 3010. `.env.local` needs `SUBSCRIPTION_MANAGEMENT_URL`, `INTERNAL_API_SECRET`, Clerk `NEXT_PUBLIC_CLERK_*` + `CLERK_SECRET_KEY`
- `pnpm mock` starts `mock-server/` (a stand-in for the backend) for local dev

## Commands

<!-- AUTO:COMMANDS:BEGIN -->
- `pnpm dev` → `next dev -p 3010`
- `pnpm mock` → `node --experimental-strip-types mock-server/index.ts`
- `pnpm build` → `next build`
- `pnpm start` → `next start`
- `pnpm lint` → `eslint`
- `pnpm test` → `vitest run`
- `pnpm coverage` → `vitest run --coverage`
- `pnpm mutate` → `stryker run`
- `pnpm mutate:baseline` → `node --experimental-strip-types scripts/update-mutation-baseline.ts`
- `pnpm mutate:compare` → `node --experimental-strip-types scripts/compare-mutation-score.ts`
- `pnpm test:watch` → `vitest`
- `pnpm ai:test:all` → `vitest run tests 2>&1 | tail -30`
- `pnpm ai:test:unit` → `vitest run tests/unit 2>&1 | tail -30`
- `pnpm ai:test:unit:verbose:fail` → `pnpm vitest run tests/unit --reporter=verbose 2>&1 | grep -A 30 "FAIL"`
- `pnpm ai:coverage` → `vitest run --coverage 2>&1 | tail -30`
- `pnpm ai:mutate` → `stryker run 2>&1 | tail -80`
- `pnpm ai:mutate:survived` → `pnpm run mutate 2>&1 | grep -A 5 "\[Survived\]"`
<!-- AUTO:COMMANDS:END -->

Prefer the `ai:*` scripts when running from an agent: they truncate output to keep agent context small. Unit tests are co-located `*.test.ts(x)` files.

## Layout

- `app/page.tsx` + `app/home/` — landing/home page variants (signed-in/out, skeleton)
- `app/api/` — BFF routes (`auth/`, `plans/`, `courses/`, `me/`): validate the Clerk session, call the backend via `lib/serverFetch.ts` (injects `x-internal-api-key`), transform responses for the client
- `app/components/` — atomic design system: `atoms/` (text: `atoms/text/`), `molecules/`, `organisms/`, `templates/`, `utilities/`
- `app/courses/` — course detail + videos (`[id]/`)
- `app/subscribe/` — checkout flow (`[planId]/`)
- `app/policies/` — static policy pages (terms, cookie policy)
- `app/lib/` — data helpers, Zod `schemas.ts`, `serverFetch.ts`, `cookies/`, test `mocks/`
- `app/types/` — shared TypeScript types
- `e2e-tests/` — `fixtures/`, `pages/`, `tests/` (run against dev server + mock)
- `mock-server/` — in-repo mock of the Express backend

### Current files

<!-- AUTO:APP:BEGIN -->
- `app/api/` — auth/, courses/, me/, plans/
- `app/components/` — atoms/, molecules/, organisms/, templates/, utilities/
- `app/courses/` — [id]/
- `app/home/` — HomeSignedIn.test.tsx, HomeSignedIn.tsx, HomeSignedOut.tsx, HomeSignedOutLayout.tsx, HomeSkeleton.test.tsx, HomeSkeleton.tsx
- `app/lib/` — cookies/, courseVideos.test.ts, courseVideos.ts, courses.test.ts, courses.ts, mocks/, plans.test.ts, plans.ts, schemas.ts, serverFetch.mock.ts, serverFetch.test.ts, serverFetch.ts
- `app/policies/` — cookie-policy/, terms-of-use/
- `app/subscribe/` — [planId]/
- `app/types/` — course.ts, plan.ts, video.ts
- `app/globals.css`
- `app/HomeContent.tsx`
- `app/icon.svg`
- `app/layout.tsx`
- `app/page.test.tsx`
- `app/page.tsx`
<!-- AUTO:APP:END -->

## Component rules (from `.clinerules`)

This block is generated verbatim from the repo's `.clinerules` file — edit that file, not this block. Bionic does not read `.clinerules` itself, which is why it is mirrored here.

<!-- AUTO:CLINERULES:BEGIN -->
- When implementing React components use components from app/components
- Always use components from app/components/atoms/text for text
- Colors should always come from app/globals.css
<!-- AUTO:CLINERULES:END -->

## Documentation

<!-- AUTO:DOCS:BEGIN -->
- `docs/api-reference.md`
- `docs/BROWSER_STORAGE.md`
- `docs/component-architecture.md`
- `docs/data-model.md`
- `docs/development.md`
- `docs/logic-flows.md`
- `docs/mutation-baseline.json`
- `docs/mutation-testing.md`
- `docs/overview.md`
<!-- AUTO:DOCS:END -->

Start with `docs/overview.md` (architecture + BFF data flow), then `docs/component-architecture.md` before writing UI.

## Working style

Search (`search_file_line`/`find_files`) before reading files; read line windows rather than whole files. Never edit or rely on `.next/`, `coverage/`, `reports/`, `.clerk/` (all gitignored).

## Maintenance

- The `<!-- AUTO:* -->` sections above are **generated** by `scripts/update-orientation.mjs`, run automatically by `git-hooks/post-commit` after commits that touch `package.json`, `app/`, `.clinerules`, or `docs/` (auto-committed when changed). Never hand-edit text between AUTO markers; regenerate instead.
- If you make a change that makes a **hand-written** section above stale (stack, conventions, rules), update that section in the same session and include it in your commit.
- New clones must run `git config core.hooksPath git-hooks` once to enable the automatic refresh.
