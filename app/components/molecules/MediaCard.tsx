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
            <div className="relative w-full flex-[3] overflow-hidden bg-[var(--color-zinc-100)]">
                {imageSection}
            </div>
            <div className="flex flex-col flex-[1] gap-2 p-4">
                <h2 className="text-base font-semibold text-[var(--color-zinc-900)] leading-snug line-clamp-2">
                    {title}
                </h2>
                {description && (
                    <p className="text-sm text-[var(--color-zinc-500)] line-clamp-3">
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