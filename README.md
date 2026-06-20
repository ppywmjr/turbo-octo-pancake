This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Turbo Octo Pancake

A specialized video subscription service built with Next.js. It manages course access, user authentication via Clerk, and subscription management through an external service.

## Quick Start

### Prerequisites

- **Node.js** 24.x
- **pnpm** 11.7+

### Installation

```bash
pnpm install
```

### Environment Variables

Copy `.env.example` (or create `.env.local`) with the required variables:

| Variable | Description |
| --- | --- |
| `SUBSCRIPTION_MANAGEMENT_URL` | Base URL of the external subscription management service |
| `INTERNAL_API_SECRET` | Secure secret for server-to-server authentication |
| Clerk variables | See [@clerk/nextjs](https://clerk.com/docs) for required `NEXT_PUBLIC_CLERK_*` and `CLERK_SECRET_KEY` |

### Run the Development Server

```bash
pnpm dev
```

The app runs on [http://localhost:3010](http://localhost:3010).

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start dev server (port 3010) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run Vitest test suite |
| `pnpm test:watch` | Run Vitest in watch mode |

## Project Structure

```
app/
  layout.tsx          # Root layout
  page.tsx            # Landing page
  api/                # BFF API routes (auth, plans, progress)
  components/         # Reusable UI components
  courses/            # Courses page & video detail pages
  subscribe/          # Subscription pages
lib/                  # Business logic & data helpers
types/                # Shared TypeScript type definitions
docs/                 # Project documentation (start here)
```

## Documentation

| Doc | What it covers |
| --- | --- |
| [docs/overview.md](./docs/overview.md) | Architecture, tech stack, data flow |
| [docs/data-model.md](./docs/data-model.md) | Core types: Plan, Course, Video |
| [docs/component-architecture.md](./docs/component-architecture.md) | Component hierarchy & patterns |
| [docs/logic-flows.md](./docs/logic-flows.md) | Auth sync & checkout flows |
| [docs/api-reference.md](./docs/api-reference.md) | Internal API route reference |
| [docs/development.md](./docs/development.md) | Setup, testing, CI/CD |
| [docs/BROWSER_STORAGE.md](./docs/BROWSER_STORAGE.md) | Cookies & sessionStorage usage |

## Deploy on Vercel

The easiest way to deploy is the [Vercel Platform](https://vercel.com/new). Ensure all environment variables are configured in the Vercel project settings before deploying.
