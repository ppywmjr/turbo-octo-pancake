export default function BillingInfo({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <p className={`text-sm text-[var(--color-text-muted)] mt-1 ${className ?? ''}`.trim()}>
            {children}
        </p>
    )
}