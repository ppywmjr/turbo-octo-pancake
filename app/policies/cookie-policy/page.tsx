'use client'

import { PageHeading, SectionHeading, BodyText } from '@/app/components/atoms/text/index'
import Table from '@/app/components/atoms/Table'
import ButtonBack from '@/app/components/atoms/ButtonBack'
import {
    clerkCookies,
    clerkSessionStorageItems,
    clerkLocalStorageNecessaryItems,
    googleNecessaryCookies,
    googleFunctionalCookies,
    googleLocalStorageFunctionalItems,
    indexedDBFunctionalItems,
    googleAnalyticsCookies,
    indexedDBAnalyticsItems,
    googleMarketingTrackingCookies,
} from '../../lib/cookies/data'

export default function CookiePolicyPage() {
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