import Link from 'next/link'
import type { ReactNode } from 'react'
import Card from '@/app/components/atoms/Card'
import { CardTitle, BodyText } from '@/app/components/atoms/text'

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
            <div className="relative w-full flex-[3] overflow-hidden bg-[var(--color-surface)]">
                {imageSection}
            </div>
            <div className="flex flex-col flex-[1] gap-2 p-4 bg-[var(--color-surface-text)]">
                <CardTitle>{title}</CardTitle>
                {description && (
                    <BodyText muted lineClamp={3}>
                        {description}
                    </BodyText>
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
