import Link from 'next/link'
import type { ReactNode } from 'react'

const BASE_CLASS =
    'group flex flex-col h-full rounded-2xl overflow-hidden bg-[var(--color-white)] shadow-sm hover:shadow-lg transition-shadow'

export default function Card({
    href,
    children,
    aspectRatio,
    ariaLabel,
}: {
    href?: string
    children: ReactNode
    aspectRatio?: string
    ariaLabel?: string
}) {
    const classes = [BASE_CLASS]
    if (aspectRatio) {
        classes.push(aspectRatio)
    }
    const className = classes.join(' ')

    if (href) {
        return (
            <Link href={href} className={className} aria-label={ariaLabel} prefetch={true}>
                {children}
            </Link>
        )
    }

    return (
        <div className={className} aria-label={ariaLabel}>
            {children}
        </div>
    )
}
