import Link from 'next/link'

export default function LinkText({
    children,
    href,
    className,
}: {
    children: React.ReactNode
    href: string
    className?: string
}) {
    return (
        <Link
            href={href}
            className={`text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors ${className ?? ''}`.trim()}
        >
            {children}
        </Link>
    )
}