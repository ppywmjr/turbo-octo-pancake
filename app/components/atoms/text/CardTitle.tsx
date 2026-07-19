const LINE_CLAMP_MAP: Record<number, string> = {
    2: 'line-clamp-2',
    3: 'line-clamp-3',
    4: 'line-clamp-4',
    5: 'line-clamp-5',
}

export default function CardTitle({
    children,
    className,
    as: Component = 'h2',
    lineClamp = 2,
}: {
    children: React.ReactNode
    className?: string
    as?: 'h2' | 'h3'
    lineClamp?: 2 | 3 | 4 | 5
}) {
    const clampClass = LINE_CLAMP_MAP[lineClamp] ?? 'line-clamp-2'
    return (
        <Component className={`text-base font-semibold text-[var(--color-text-primary)] leading-snug ${clampClass} ${className ?? ''}`.trim()}>
            {children}
        </Component>
    )
}