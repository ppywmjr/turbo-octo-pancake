export default function BrandDivider({
    className,
}: {
    className?: string
}) {
    return (
        <div className={`w-16 h-1 rounded-full bg-[var(--color-brand)] ${className ?? ''}`.trim()} />
    )
}