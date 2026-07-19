type StatusBadgeVariant = 'watched' | 'in-progress'

const VARIANT_CLASSES: Record<StatusBadgeVariant, { bg: string; text: string }> = {
    watched: {
        bg: 'bg-[var(--color-success)]',
        text: 'text-[var(--color-white)]',
    },
    'in-progress': {
        bg: 'bg-[var(--color-warning)]',
        text: 'text-[var(--color-white)]',
    },
}

export default function StatusBadge({
    children,
    className,
    variant = 'watched',
}: {
    children: React.ReactNode
    className?: string
    variant?: StatusBadgeVariant
}) {
    const colors = VARIANT_CLASSES[variant]
    return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} ${className ?? ''}`.trim()}>
            {children}
        </span>
    )
}