import Link from 'next/link'
import type { ReactNode } from 'react'

export default function MediaCard({
    imageSection,
    title,
    description,
    href,
}: {
    imageSection: ReactNode
    title: string
    description?: string | null
    href?: string
}) {
    const isLink = !!href

    return (
        <div className="group flex flex-col h-full rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg transition-shadow">
            {isLink ? (
                <Link
                    href={href}
                    className="relative w-full h-56 overflow-hidden bg-zinc-100 dark:bg-zinc-800"
                >
                    {imageSection}
                </Link>
            ) : (
                <div className="relative w-full h-56 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    {imageSection}
                </div>
            )}
            <div className="flex flex-col flex-1 gap-2 p-4">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 leading-snug line-clamp-2">
                    {title}
                </h2>
                {description && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3">
                        {description}
                    </p>
                )}
            </div>
        </div>
    )
}
