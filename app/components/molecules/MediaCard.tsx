import Link from 'next/link'
import type { ReactNode } from 'react'
import Card from '@/app/components/atoms/Card'

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
    const cardContent = (
        <>
            <div className="relative w-full flex-[3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {imageSection}
            </div>
            <div className="flex flex-col flex-[1] gap-2 p-4">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 leading-snug line-clamp-2">
                    {title}
                </h2>
                {description && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3">
                        {description}
                    </p>
                )}
            </div>
        </>
    )

    return (
        <Card href={href} aspectRatio="aspect-[4/3]">
            {cardContent}
        </Card>
    )
}