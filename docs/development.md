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
The application will be available at `http://localhost:3000` (or the port specified in your terminal).

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
