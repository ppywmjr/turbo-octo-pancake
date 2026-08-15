# Development & Operations

This document provides guidance on setting up, developing, and testing the application.

## Local Setup

### Prerequisites
*   **Node.js**: Ensure you have a compatible version of Node.js installed (the CI uses version 24).
*   **pnpm**: This project uses `pnpm` as its package manager.

### Installation
To install the necessary dependencies, run:
```bash
pnpm install
```

### Running the Development Server
To start the local development server, run:
```bash
pnpm dev
```
The application will be available at `http://localhost:3010` (or the port specified in your terminal).

### Running Locally Without the Subscription-Management Service

The app communicates with an external subscription-management service at `SUBSCRIPTION_MANAGEMENT_URL`.
To develop and test locally without that backend, a built-in mock server is provided.

#### Start the Mock Server
```bash
pnpm mock
```
This starts a stub service on `http://localhost:3011` that returns pre-seeded responses for every
endpoint the app calls (plans, courses, videos, subscriptions, checkout, auth sync). State is
in-memory — activations and progress updates mutate the local store, and a fresh `pnpm mock`
resets everything.

#### Run Both Together
```bash
# Terminal 1
pnpm mock

# Terminal 2
pnpm dev
```

The app reads `SUBSCRIPTION_MANAGEMENT_URL=http://localhost:3011` from `.env`, so no
configuration changes are needed.

#### What the Mock Supports
| Upstream endpoint | Behavior |
|---|---|
| `GET /plans` | Returns 2 seeded plans (one free, one paid) |
| `GET /me/courses` | Starts empty; populated when you activate a subscription |
| `POST /me/subscriptions` | Any activation code subscribes to the "Flutters Online Training Programme" plan; returns 409 on duplicate |
| `GET /courses/:id` | Returns the course if it exists in `/me/courses`, otherwise 404 |
| `GET /me/courses/:id/videos` | Returns the seeded video list for that course id |
| `GET /me/courses/:id/videos/:videoId` | Returns a single video by id |
| `POST /me/courses/:id/videos/:videoId/progress` | Updates `watched` and/or `progressSecs` in memory; returns 204 |
| `POST /plans/:planId/subscribe` | Returns a fake `checkoutUrl` (e.g. `https://checkout.example.com/mock/:planId`) |
| `POST /signup` | Returns 202 (the app only checks for a 2xx response) |

#### Notes
* The mock does **not** validate Clerk Bearer tokens or the internal API key — it accepts any request.
* The mock server is implemented in `mock-server/index.ts` using only Node's built-in `http` module.
* You can change the port via the `MOCK_PORT` environment variable: `MOCK_PORT=9999 pnpm mock`.

## Development Workflow

### Coding Standards
*   **TypeScript**: All code should be written in TypeScript, adhering to strict type safety.
*   **Next.js App Router**: Follow the conventions of the Next.js App Router for routing, layouts, and server/client component separation.
*   **Component Structure**: Keep components modular and reusable within the `app/components` directory.

### Testing
The project uses **Vitest** for unit and integration testing.

#### Running Tests
To run the entire test suite, use:
```bash
pnpm test
```

#### Running Specific Tests
To run tests for a specific file or directory, you can pass the path to Vitest:
```bash
pnpm test path/to/file.test.ts
```

### CI/CD (GitHub Actions)
The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that automates the following on every push or pull request to `main`:
1.  **Build**: Installs dependencies and prepares the environment.
2.  **Test**: Runs the full test suite to ensure code quality and prevent regressions.

## Troubleshooting
*   **Dependency Issues**: If you encounter issues with `node_modules`, try deleting the folder and running `pnpm install` again.
*   **Environment Variables**: Ensure all required environment variables (see `docs/overview.md`) are set in your local `.env` file.
