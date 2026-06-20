# Project Overview & Architecture

## Mission Statement
This application is a specialized video subscription service built with Next.js. It serves as a frontend and Backend-for-Frontend (BFF) that manages course access, user authentication via Clerk, and subscription management through an external service.

## Tech Stack Summary
*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Authentication**: [Clerk](https://clerk.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
*   **Package Manager**: [pnpm](https://pnpm.io/)

## System Architecture
The application follows a modern web architecture where the Next.js app acts as the primary user interface and orchestrator.

### High-Level Components
1.  **Frontend (Next.js App Router)**: Handles routing, UI rendering, and client-side interactions.
2.�  **BFF (Backend-for-Frontend)**: The `app/api` routes act as a secure bridge between the client and the external subscription management service. They handle authentication, request signing, and data transformation.
3.   **External Subscription Management Service**: The authoritative source for plans, courses, and user subscription status. This service is accessed via secure server-side calls using `serverFetch`.

### Data Flow Overview
*   **User Interaction**: A user interacts with the UI (e.g., clicking a "Subscribe" button).
*   **BFF Processing**: The request is sent to an internal API route. This route validates the user's session (via Clerk) and communicates with the external service using a secure internal API key.
*   **External Service**: The external service processes the request and returns data (e.g., a checkout URL or updated plan info).
*   **UI Update**: The BFF returns the response to the client, which then updates the UI or redirects the user.

## Environment Configuration
The application relies on several critical environment variables to function correctly and securely:

| Variable | Description | Purpose |
| :--- | :--- | :--- |
| `SUBSCRIPTION_MANAGEMENT_URL` | The base URL of the external subscription management service. | Used for all outgoing API calls to the backend service. |
| `INTERNAL_API_SECRET` | A secure secret used for server-to-server authentication. | Injected into headers via `serverFetch` to authorize requests to the external service. |

**Note**: These variables must be correctly configured in both local development and production environments to ensure connectivity and security.
