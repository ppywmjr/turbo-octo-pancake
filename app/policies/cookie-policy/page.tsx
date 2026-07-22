'use client'

import { PageHeading, SectionHeading, BodyText } from '@/app/components/atoms/text/index'
import Table from '@/app/components/atoms/Table'
import ButtonBack from '@/app/components/atoms/ButtonBack'

export default function CookiePolicyPage() {
    const clerkCookies = [
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
    const clerkSessionStorageItems = [
        {
            origin: 'www.mikejamesrust.com',
            key: 'auth-synced-user_[id]',
            purpose: 'Flag Clerk uses to confirm auth state has been synced for this tab/session',
            category: 'Necessary',
        },
    ];
    const clerkLocalStorageNecessaryItems = [
        {
            origin: 'www.mikejamesrust.com',
            key: '__clerk_environment',
            purpose: "Caches Clerk's environment/config (auth settings, instance config) so the SDK doesn't refetch it every load",
            category: 'Necessary',
        },
    ];
    const googleNecessaryCookies = [
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
    ];
    const googleFunctionalCookies = [
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
    ];
    const googleLocalStorageFunctionalItems = [
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
    ];


    const indexedDBFunctionalItems = [
        {
            database: 'YtIdbMeta → databases',
            store: '—',
            purpose: 'Registry of which per-user YouTube databases exist on this browser',
            category: 'Functional',
        },
    ];

    const googleAnalyticsCookies = [
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
    const indexedDBAnalyticsItems = [
        {
            database: 'LogsDatabaseV2:[id] → LogsRequestsStore → newRequestV2',
            store: '—',
            purpose: 'Local queue of player telemetry/request logs (buffering playback/error events before sending)',
            category: 'Analytics',
        },
    ];

    const googleMarketingTrackingCookies = [
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
    ];

    return (
        <main className="flex flex-1 flex-col items-center py-16 px-8 bg-[var(--color-surface)] min-h-screen">
            <div className="w-full max-w-5xl flex flex-col gap-6">
                <ButtonBack href="/">Home</ButtonBack>

                <PageHeading>Cookie & storage policy</PageHeading>

                <BodyText>
                    This site stores some data on your device inside your web browser, eg. Chrome, in the form of cookies, session storage, local storage, and indexeddb. These are all different methods of preserving information to help the website function, eg. keep you logged in so the server can show you pages that you have access to. Some are necessary for the website to work, some are function, eg saving preferences, some are for analytics, eg. tracking how many people are watching a particular video, and tracking/marketing cookies that are used by Google in their advertising business. All but the necessary cookies require your permission.
                </BodyText>
                <BodyText>
                    This site uses a service called Clerk to manage logged in state. As such all of those cookies and other storage are strictly necessary. It also uses Youtube's services to host the videos. As part of hosting the videos Youtube uses necessary, functional, analytics, and tracking/marketing cookies and other storage. These are required to access this site as per the Terms of Use, because otherwise Youtube will not display the video, but not strictly necessary, because Youtube do not need to require us to add them.
                </BodyText>

                <SectionHeading>What are cookies, session storage, local storage, and indexeddb</SectionHeading>

                <BodyText>
                    <strong>Cookies</strong> are small text values stored on your device by your web browser. They allow websites to remember information about your visit, such as authentication status, preferences, and session data. Cookies are sent with every request to the same domain and persist until they expire or are manually deleted.
                </BodyText>
                <BodyText>
                    <strong>Local Storage</strong> is a web storage API that provides larger capacity (typically 5-10MB) than cookies for storing key-value pairs permanently in the browser. Unlike cookies, data stored in local storage is not sent to the server with every request and only gets cleared when explicitly removed by JavaScript or the user.
                </BodyText>
                <BodyText>
                    <strong>Session Storage</strong> is similar to local storage but data is limited to a single tab or browser window session. The data persists across page reloads within the same tab but is automatically cleared when the tab or window is closed.
                </BodyText>
                <BodyText>
                    <strong>IndexedDB</strong> is a low-level API for storing large amounts of structured data, including files and blobs. It provides a full database system with indexes and transactions within the browser, capable of storing significantly more data than local storage (often limited only by disk space).
                </BodyText>

<SectionHeading>Necessary items</SectionHeading>
                <SectionHeading as='h3' >1. Clerk & first-party cookies (mikejamesrust.com / clerk.com / clerk.mikejamesrust.com)</SectionHeading>

<BodyText>The following cookies and storage items are neccessary</BodyText>

                <Table columns={['Cookie Name', 'Domain', 'Purpose', 'Category']} data={clerkCookies} />

                <SectionHeading as='h3' >Session Storage</SectionHeading>

                <Table columns={['Origin', 'Key', 'Purpose', 'Category']} data={clerkSessionStorageItems} />

                <SectionHeading as='h3' >Local Storage</SectionHeading>

                <Table columns={['Origin', 'Key', 'Purpose', 'Category']} data={clerkLocalStorageNecessaryItems} />


                <SectionHeading as='h3' >YouTube necessary cookies</SectionHeading>

                <Table columns={['Cookie Name', 'Domain', 'Purpose', 'Category']} data={googleNecessaryCookies} />

<SectionHeading>Functional items</SectionHeading>
                <SectionHeading as='h3' >Cookies</SectionHeading>

                <Table columns={['Cookie Name', 'Domain', 'Purpose', 'Category']} data={googleFunctionalCookies} />

                <SectionHeading as='h3' >Local Storage</SectionHeading>

                <Table columns={['Origin', 'Key', 'Purpose', 'Category']} data={googleLocalStorageFunctionalItems} />

                <SectionHeading as='h3' >IndexedDB</SectionHeading>

                <Table columns={['Database', 'Store', 'Purpose', 'Category']} data={indexedDBFunctionalItems} />
<SectionHeading>Analytics items</SectionHeading>
                <SectionHeading as='h3' >Cookies</SectionHeading>

                <Table columns={['Cookie Name', 'Domain', 'Purpose', 'Category']} data={googleAnalyticsCookies} />

                <SectionHeading as='h3' >IndexedDB</SectionHeading>

                <Table columns={['Database', 'Store', 'Purpose', 'Category']} data={indexedDBAnalyticsItems} />
<SectionHeading>Marketing / Tracking items</SectionHeading>
                <SectionHeading as='h3' >Cookies</SectionHeading>

                <Table columns={['Cookie Name', 'Domain', 'Purpose', 'Category']} data={googleMarketingTrackingCookies} />

            </div>
        </main>
    )
}