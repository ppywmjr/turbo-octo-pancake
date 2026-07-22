type SectionHeadingAs = 'h2' | 'h3' | 'h4'

const headingStyles: Record<SectionHeadingAs, string> = {
    h2: 'text-2xl font-bold tracking-tight text-[var(--color-text-primary)]',
    h3: 'text-xl font-semibold tracking-tight text-[var(--color-text-primary)]',
    h4: 'text-lg font-semibold tracking-tight text-[var(--color-text-primary)]',
}

export default function SectionHeading({
    children,
    className,
    as = 'h2',
}: {
    children: React.ReactNode
    className?: string
    as?: SectionHeadingAs
}) {
    const Tag = as
    return (
        <Tag className={`${headingStyles[as]} ${className ?? ''}`.trim()}>
            {children}
        </Tag>
    )
}
