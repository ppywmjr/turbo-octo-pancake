type StatusBadgeVariant = 'watched' | 'in-progress'

const VARIANT_CLASSES: Record<StatusBadgeVariant, { bg: string; text: string }> = {
    watched: {
        bg: 'bg-[var(--color-success)]',
        text: 'text-[var(--color-white)]',
    },
    'in-progress': {
        bg: 'bg-[var(--color-warning)]',
        text: 'text-[var(--color-black)]',
    },
}

export default function StatusBadge({
    textContent,
    className,
    variant = 'watched',
}: {
    textContent: string
    className?: string
    variant?: StatusBadgeVariant
}) {
    const colors = VARIANT_CLASSES[variant]
    return (
        <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} absolute top-5 right-5 z-10 w-[100px] text-center ${className || ''}`.trim()}
            aria-hidden="true"
        >
            {textContent}
        </span>
    )
}
