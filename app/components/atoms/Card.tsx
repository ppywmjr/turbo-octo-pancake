import Link from 'next/link'
import type { ReactNode } from 'react'

const WRAPPER_CLASS =
    'group flex flex-col h-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow'

export default function Card({
    href,
    children,
}: {
    href?: string
    children: ReactNode
}) {
    if (href) {
        return (
            <Link href={href} className={WRAPPER_CLASS}>
                {children}
            </Link>
        )
    }

    return (
        <div className={WRAPPER_CLASS}>{children}</div>
    )
}
