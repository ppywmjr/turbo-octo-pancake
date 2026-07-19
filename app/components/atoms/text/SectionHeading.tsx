export default function SectionHeading({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <h2 className={`text-2xl font-bold tracking-tight text-[var(--color-text-primary)] ${className ?? ''}`.trim()}>
            {children}
        </h2>
    )
}