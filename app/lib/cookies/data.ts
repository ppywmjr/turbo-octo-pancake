export interface CookieData {
    [key: string]: string
    name: string
    domain: string
    description: string
    category: string
}

export interface StorageData {
    [key: string]: string
    origin: string
    key: string
    purpose: string
    category: string
}

export interface IndexedDBData {
    [key: string]: string
    database: string
    store: string
    purpose: string
    category: string
}

export const clerkCookies: CookieData[] = [
    {
        name: '__client_uat',
        domain: '.mikejamesrust.com',
        description: 'Timestamp flag indicating whether a Clerk logged in session exists; used to sync signed-in state across tabs/domains without exposing the token itself',
        category: 'Necessary',
    },
    {
        name: '__client_uat',
        domain: '.clerk.com',
        description: 'Same as above, Clerk\'s own domain copy',
        category: 'Necessary',
    },
    {
        name: '__client_uat_DvlHvy3E',
        domain: '.clerk.com',
        description: 'Instance-specific variant of __client_uat (suffix ties it to your Clerk instance)',
        category: 'Necessary',
    },
    {
        name: '__client_uat_li9CUjqJ',
        domain: '.mikejamesrust.com',
        description: 'Instance-specific variant of __client_uat',
        category: 'Necessary',
    },
    {
        name: '__refresh_li9CUjqJ',
        domain: 'www.mikejamesrust.com',
        description: 'Refresh token used to silently renew the session token',
        category: 'Necessary',
    },
    {
        name: 'clerk_active_context',
        domain: 'www.mikejamesrust.com',
        description: 'Tracks which session/organisation context is currently active',
        category: 'Necessary',
    },
    {
        name: '__client',
        domain: '.clerk.mikejamesrust.com',
        description: 'Main authentication cookie (long-lived, HttpOnly) — the core "is this user logged in" credential',
        category: 'Necessary',
    },
    {
        name: '__session',
        domain: 'www.mikejamesrust.com',
        description: 'Short-lived session token (JWT), used to authenticate requests',
        category: 'Necessary',
    },
    {
        name: '__session_li9CUjqJ',
        domain: 'www.mikejamesrust.com',
        description: 'Instance-specific variant of __session',
        category: 'Necessary',
    },
    {
        name: '_cfuvid',
        domain: '.clerk.mikejamesrust.com',
        description: 'Cloudflare cookie used alongside rate-limiting/Bot Management to distinguish sessions; not itself a tracking cookie but worth flagging as Cloudflare infrastructure rather than Clerk',
        category: 'Necessary',
    },
    {
        name: '__cf_bm',
        domain: '.clerk.mikejamesrust.com',
        description: 'Cloudflare Bot Management — distinguishes human traffic from bots, ~30 min lifetime',
        category: 'Necessary',
    },
]

export const clerkSessionStorageItems: StorageData[] = [
    {
        origin: 'www.mikejamesrust.com',
        key: 'auth-synced-user_[id]',
        purpose: 'Flag Clerk uses to confirm auth state has been synced for this tab/session',
        category: 'Necessary',
    },
]

export const clerkLocalStorageNecessaryItems: StorageData[] = [
    {
        origin: 'www.mikejamesrust.com',
        key: '__clerk_environment',
        purpose: "Caches Clerk's environment/config (auth settings, instance config) so the SDK doesn't refetch it every load",
        category: 'Necessary',
    },
]

export const googleNecessaryCookies: CookieData[] = [
    {
        name: 'SIDCC, __Secure-1PSIDCC, __Secure-3PSIDCC',
        domain: '.youtube.com',
        description: 'Session continuity/security tokens tied to the SID family',
        category: 'Necessary',
    },
    {
        name: '__Secure-1PSIDTS, __Secure-3PSIDTS',
        domain: '.youtube.com',
        description: 'Session timestamp tokens, part of the SID family',
        category: 'Necessary',
    },
    {
        name: '__Secure-YENID',
        domain: '.youtube.com',
        description: 'Successor to __Secure-YEC, same bot-detection purpose',
        category: 'Necessary',
    },
]

export const googleFunctionalCookies: CookieData[] = [
    {
        name: 'PREF',
        domain: '.youtube.com',
        description: 'Stores user preferences (playback quality, language, UI settings)',
        category: 'Functional',
    },
    {
        name: 'VISITOR_PRIVACY_METADATA',
        domain: '.youtube.com',
        description: 'Stores consent/privacy-state metadata for the visitor',
        category: 'Functional',
    },
]

export const googleLocalStorageFunctionalItems: StorageData[] = [
    {
        origin: 'www.youtube.com (third-party, embedded)',
        key: 'yt-icons-last-purged',
        purpose: 'Housekeeping timestamp for when the player last cleared cached icon assets',
        category: 'Functional',
    },
    {
        origin: 'www.youtube.com (third-party, embedded)',
        key: 'yt-player-bandwidth',
        purpose: 'Stores measured bandwidth/stall data to pick video quality',
        category: 'Functional',
    },
    {
        origin: 'www.youtube.com (third-party, embedded)',
        key: 'ytidb::LAST_RESULT_ENTRY_KEY',
        purpose: "Internal pointer into the player's local IndexedDB result cache",
        category: 'Functional',
    },
]

export const indexedDBFunctionalItems: IndexedDBData[] = [
    {
        database: 'YtIdbMeta → databases',
        store: '—',
        purpose: 'Registry of which per-user YouTube databases exist on this browser',
        category: 'Functional',
    },
]

export const googleAnalyticsCookies: CookieData[] = [
    {
        name: '__Secure-YNID',
        domain: '.youtube.com',
        description: 'Analytics/preferences for YouTube (successor to VISITOR_INFO1_LIVE)',
        category: 'Analytics',
    },
    {
        name: 'VISITOR_INFO1_LIVE',
        domain: '.youtube.com',
        description: 'Measures bandwidth/usage and feeds video recommendations',
        category: 'Analytics',
    },
]

export const indexedDBAnalyticsItems: IndexedDBData[] = [
    {
        database: 'LogsDatabaseV2:[id] → LogsRequestsStore → newRequestV2',
        store: '—',
        purpose: 'Local queue of player telemetry/request logs (buffering playback/error events before sending)',
        category: 'Analytics',
    },
]

export const googleMarketingTrackingCookies: CookieData[] = [
    {
        name: 'APISID, SAPISID',
        domain: '.youtube.com',
        description: 'Google states these both support account/session security and are used to personalise ads based on recent activity',
        category: 'Marketing / Tracking',
    },
    {
        name: '__Secure-1PAPISID, __Secure-3PAPISID',
        domain: '.youtube.com',
        description: 'First-party/third-party partitioned variants of APISID, same dual purpose',
        category: 'Marketing / Tracking',
    },
    {
        name: 'LOGIN_INFO',
        domain: '.youtube.com',
        description: 'Stores your Google login state/info for personalisation of the embedded player',
        category: 'Marketing / Tracking',
    },
]

// Combined necessary items across all providers
export const allNecessaryCookies: CookieData[] = [
    ...clerkCookies,
    ...googleNecessaryCookies,
]

export const allNecessaryLocalStorage: StorageData[] = [
    ...clerkLocalStorageNecessaryItems,
]

export const allNecessarySessionStorage: StorageData[] = [
    ...clerkSessionStorageItems,
]

export const allNecessaryIndexedDB: IndexedDBData[] = []
