# Browser Storage

Documentation of all browser storage (cookies and `sessionStorage`) used by this application.

---

## Functional

Storage used to control application behaviour on the client side.

### `sessionStorage`

| Key | Value | Set by | Cleared |
|-----|-------|--------|---------|
| `auth-synced-<userId>` | `"1"` | `app/components/AuthSync.tsx` | End of browser session (tab/window close) |

**Purpose:** Prevents `AuthSync` from re-posting to `/api/auth/sync` on every page navigation within the same browser session. Once the key is present, the component skips the sync request. The key is scoped per user ID so that switching accounts within the same session still triggers a sync for the new user.

---

## Cookies

### Functional cookies

This application uses [Clerk](https://clerk.com) for authentication. Clerk manages its own cookies automatically via `<ClerkProvider>` and `clerkMiddleware` (`proxy.ts`). For the full reference on what cookies Clerk sets, their attributes (domain, `HttpOnly`, `SameSite`, expiry), and their purpose, see:

> **[Clerk's cookies & tokens in detail](https://clerk.com/docs/guides/how-clerk-works/overview#clerks-cookies-and-tokens-in-detail)**

In summary, Clerk uses two cookies on authenticated sessions:

| Cookie | Domain | `HttpOnly` | Lifetime | Purpose |
|--------|--------|------------|----------|---------|
| `__client` | Clerk FAPI subdomain (`clerk.example.com`) | Yes | Browser-dependent | Long-lived client token; source of truth for session state. Production only. |
| `__session` | Application domain (`example.com`) | No | 60 seconds (auto-refreshed every 50 s) | Short-lived JWT sent with every request to verify the authenticated user. |

> **Note:** In development, Clerk transmits session state via a `__clerk_db_jwt` query-string parameter instead of the `__client` cookie, because `localhost` and the Clerk FAPI domain are cross-site. This is not used in production.
