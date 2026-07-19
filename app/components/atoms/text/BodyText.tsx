const LINE_CLAMP_MAP: Record<number, string> = {
    2: 'line-clamp-2',
    3: 'line-clamp-3',
    4: 'line-clamp-4',
    5: 'line-clamp-5',
}

export default function BodyText({
    children,
    className,
    muted = false,
    lineClamp, // truncates after this number of lines
}: {
    children: React.ReactNode
    className?: string
    muted?: boolean
    lineClamp?: 2 | 3 | 4 | 5
}) {
    const base = muted
        ? 'text-sm text-[var(--color-text-muted)]'
        : 'text-lg text-[var(--color-text-muted)]'
    const classes = [base]
    if (lineClamp) {
        classes.push(LINE_CLAMP_MAP[lineClamp] ?? '')
    }
    if (className) {
        classes.push(className)
    }
    return (
        <p className={classes.filter(Boolean).join(' ').trim()}>
            {children}
        </p>
    )
}