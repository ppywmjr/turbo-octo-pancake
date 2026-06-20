# API Reference

This document provides a technical reference for the internal API routes of the application. These endpoints act as the Backend-for-Frontend (BFF), handling secure communication between the client and the external subscription management service.

**Note**: All API routes require valid authentication via Clerk. Requests are validated on the server side before being processed.

---

## Authentication & User Sync

### `POST /api/auth/sync`
This endpoint synchronizes the authenticated user's information with the external subscription management service.

*   **Purpose**: To ensure that when a user signs in via Clerk, their identity is also registered/updated in the subscription system.
*   **Authentication**: Required (Clerk session).

#### Request Body
The request body is not explicitly required by the client but is used to pass user data to the external service.

| Field | Type | Description |
| :--- | :--- | :--- |
| `clerkUserId` | `string` | The unique identifier for the user from Clerk. |
| `email` | `string` | The user's primary email address from Clerk. |

#### Response
| Status Code | Description |
| :--- | :--- |
| `204 No Content` | The synchronization was successful. |
| `401 Unauthorized` | The user is not authenticated or the session is invalid. |
| `503 Service Unavailable` | The external subscription service is unreachable or misconfigured. |

---

## Subscription & Checkout

### `POST /api/plans/[planId]/checkout`
This endpoint initiates the checkout process for a specific subscription plan.

*   **Purpose**: To generate a secure, one-time-use checkout URL from the external service.
*   **Authentication**: Required (Clerk session).

#### Path Parameters
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `planId` | `string` | The unique identifier of the plan to be purchased. |

#### Request Body
The request body is empty.

#### Response
| Status Code | Description |
| :--- | :--- |
| `200 OK` | The checkout URL was successfully generated. |
| `401 Unauthorized` | The user is not authenticated. |
| `503 Service Unavailable` | The external subscription service is unreachable or misconfigured. |

#### Success Response Body (JSON)
| Field | Type | Description |
| :--- | :--- | :--- |
| `checkoutUrl` | `string` | The unique, one-time-use URL to redirect the user for payment. |

**Example Success Response:**
```json
{
  "checkoutUrl": "https://subscription-service.com/checkout/session_abc123"
}
```

---

## Summary of Security & Error Handling

### Security Measures
*   **Session Validation**: Every request is validated against the user's Clerk session.
*   **Server-to-Server Communication**: All sensitive calls to the external service are made from the server side using `serverFetch`, which includes a secure `x-internal-api-key`.
*   **One-Time Use URLs**: The checkout process generates unique, short-lived URLs to prevent replay attacks.

### Error Handling
The API uses standard HTTP status codes to communicate the outcome of requests:
*   **`4xx` Errors**: Indicate client-side issues (e.g., `401 Unauthorized`).
*   **`5xx` Errors**: Indicate server-side or external service issues (e.g., `503 Service Unavailable`).
*   **Error Details**: In some cases, the response body may contain a JSON object with an `error` message and additional details to assist in debugging.
