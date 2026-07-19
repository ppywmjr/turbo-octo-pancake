export default function PageHeading({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <h1 className={`text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] ${className ?? ''}`.trim()}>
            {children}
        </h1>
    )
}