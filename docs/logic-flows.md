# Core Logic & Data Flows

This document describes the most critical logic and data flows within the application, specifically focusing on how it interacts with external services and manages user state.

## 1. Authentication & User Sync Flow

The application uses **Clerk** for user authentication. To ensure the external subscription service is aware of authenticated users, a synchronization process is implemented.

### The Flow
1.  **User Authentication**: A user signs in via Clerk on the frontend.
2.  **Sync Trigger**: The `AuthSync` component (or a similar mechanism) triggers an authentication synchronization.
3.  **API Request**: A `POST` request is sent to `/api/auth/sync`.
4.  **BFF Processing**: 
    *   The `/api/auth/sync` route retrieves the user's identity and email from Clerk.
    *   It then makes a secure, server-side request to the external subscription service using `serverFetch`.
    *   The request includes the user's unique Clerk ID and email.
5.  **External Service Update**: The external service receives the user data, creates or updates a corresponding user record in its own database, and returns a response.
6.  **Completion**: The API route completes the request, ensuring the user is now "known" to the subscription system.

**Key Components Involved:**
*   `AuthSync.tsx`: The client-side component that initiates the sync.
*   `/api/auth/sync/route.ts`: The backend endpoint handling the synchronization logic.
*   `serverFetch.ts`: The utility used for secure, authenticated server-to-server communication.

---

## 2. Subscription & Checkout Flow

This is the primary conversion path for users to gain access to content.

### The Flow
1.  **Plan Selection**: A user views available plans on the home page or a dedicated subscription page.
2.  **Initiate Checkout**: The user clicks a "Subscribe" button (e.s., `SubscribeButton`).
3.  **BFF Checkout Request**: 
    *   The client sends a `POST` request to `/api/plans/[planId]/checkout`.
    *   The API route validates the user's session via Clerk.
4.  **External Service Handshake**: 
    *   The API route requests a unique checkout URL from the external subscription service.
    *   This request is signed with an internal API key for security.
5.  **Redirection**: 
    *   The external service returns a unique, one-time-use checkout URL.
    *   The API route returns this URL to the client.
    *   The client-side code (e.g., in `SubscribeButton`) redirects the user to the external checkout page.
6.  **Completion**: Once the user completes the payment on the external site, they are redirected back to the application.

**Key Components Involved:**
*   `SubscribeButton.tsx`: The UI element that triggers the checkout process.
*   `/api/plans/[planId]/checkout/route.ts`: The API endpoint that orchestrates the checkout request.
*   `serverFetch.ts`: Used for secure communication with the external service.

---

## Summary of Security Patterns

To maintain a secure environment, the application employs several key patterns:
*   **BFF Pattern**: All sensitive communication with the external service happens on the server side via API routes, preventing exposure of secrets to the client.
*   **Server-Side Authentication**: The application uses Clerk's server-side utilities (`auth()`, `currentUser()`) to verify user identity before performing any sensitive actions.
*   **Internal API Security**: The `serverFetch` utility automatically attaches a secure `x-internal-api-key` to all outgoing requests, ensuring only authorized requests from the application are accepted by the external service.
*   **Token-Based Authorization**: When communicating with the external service, the application often passes a user's JWT (JSON Web Token) to maintain identity context.
