import Link from 'next/link'
import type { ReactNode } from 'react'

const BASE_CLASS =
    'group flex flex-col h-full rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg transition-shadow'

export default function Card({
    href,
    children,
    aspectRatio,
}: {
    href?: string
    children: ReactNode
    aspectRatio?: string
}) {
    const classes = [BASE_CLASS]
    if (aspectRatio) {
        classes.push(aspectRatio)
    }
    const className = classes.join(' ')

    if (href) {
        return (
            <Link href={href} className={className}>
                {children}
            </Link>
        )
    }

    return (
        <div className={className}>{children}</div>
    )
}
