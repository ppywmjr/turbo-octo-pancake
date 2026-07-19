export default function PageLabel({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <p className={`text-xs font-semibold uppercase tracking-widest text-[var(--color-brand)] ${className ?? ''}`.trim()}>
            {children}
        </p>
    )
}