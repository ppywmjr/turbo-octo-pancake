# Project Context

This is a Next.js (App Router) video subscription service. Before writing any code, read the docs folder for a complete overview:

1. **docs/overview.md** — Architecture, tech stack, data flow, env vars
2. **docs/data-model.md** — Core types: Plan, Course, Video
3. **docs/component-architecture.md** — Component hierarchy & patterns
4. **docs/logic-flows.md** — Auth sync & checkout flows
5. **docs/api-reference.md** — Internal API route reference
6. **docs/development.md** — Setup, testing, CI/CD
7. **docs/BROWSER_STORAGE.md** — Cookies & sessionStorage
8. **docs/mutation-testing.md** — Mutation testing workflow

## Key Conventions

- **Framework**: Next.js App Router with TypeScript (strict)
- **Auth**: Clerk (`@clerk/nextjs`)
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest + React Testing Library
- **Package manager**: pnpm
- **Dev server port**: 3010 (not 3000)
- **Architecture**: BFF pattern — `app/api` routes bridge the client to an external subscription service via `serverFetch`
- **Types**: All core types live in `app/types/`. Never use `any`.
- **Client vs Server**: Mark interactive components with `'use client'`. Use Server Components for data fetching.

## After Making Changes

If you modify code, types, components, API routes, or storage behavior, check whether the docs in `docs/` need updating. Specifically:

- **New or changed types** → update `docs/data-model.md`
- **New or changed components** → update `docs/component-architecture.md`
- **New or changed flows** (auth, checkout, etc.) → update `docs/logic-flows.md`
- **New or changed API routes** → update `docs/api-reference.md`
- **New or changed storage** (cookies, sessionStorage) → update `docs/BROWSER_STORAGE.md`
- **Changed scripts, setup, or architecture** → update `docs/development.md` or `docs/overview.md`

When in doubt, update the docs. The documentation is the source of truth for this project.

## Testing
The following command are pre-approved to run as ai. You should run them after every complete job. Use the results to determine if the code is working as expected or if extra coverage is needed.
```
pnpm run ai:test:all
pnpm run ai:test:unit
pnpm run ai:test:unit:verbose:fail
pnpm run ai:coverage
```