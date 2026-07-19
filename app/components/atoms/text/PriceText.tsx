type PriceSize = 'medium' | 'large'

const SIZE_CLASSES: Record<PriceSize, string> = {
    medium: 'text-lg font-bold',
    large: 'text-3xl font-bold',
}

export default function PriceText({
    children,
    className,
    size = 'medium',
}: {
    children: React.ReactNode
    className?: string
    size?: PriceSize
}) {
    return (
        <p className={`${SIZE_CLASSES[size]} text-[var(--color-text-primary)] ${className ?? ''}`.trim()}>
            {children}
        </p>
    )
}