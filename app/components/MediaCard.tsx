import Card from '@/app/components/Card'
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
    return (
        <Card href={href}>
            <div className="relative w-full aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {imageSection}
            </div>
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
        </Card>
    )
}
