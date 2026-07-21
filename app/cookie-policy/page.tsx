'use client'

import { PageHeading, SectionHeading, BodyText } from '@/app/components/atoms/text/index'
import Table from '@/app/components/atoms/Table'

export default function CookiePolicyPage() {
    const cookies = [
        {
            name: '__client_uat',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. This cookie maintains the logged in session for authenticated users.',
        },
        {
            name: '__session',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. This cookie maintains the logged in session for authenticated users.',
        },
    ]

    return (
        <main className="flex flex-1 flex-col items-center py-16 px-8 bg-[var(--color-surface)] min-h-screen">
            <div className="w-full max-w-5xl flex flex-col gap-6">
                <PageHeading>Cookie Policy</PageHeading>

                <SectionHeading>What are Cookies</SectionHeading>
                <BodyText>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </BodyText>

                <SectionHeading>Cookies We Use</SectionHeading>
                <Table columns={['Cookie Name', 'Description']} data={cookies} />

                <BodyText>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
                </BodyText>

                <BodyText>
                    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                </BodyText>
            </div>
        </main>
    )
}