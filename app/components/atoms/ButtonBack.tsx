'use client'

import Link from 'next/link'

interface ButtonBackProps {
  href: string
  children?: React.ReactNode
}

export default function ButtonBack({ href, children }: ButtonBackProps) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 self-start text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all duration-150"
    >
      <svg
        className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
      <span className="p-[10px] pl-[1]">{children || 'Back'}</span>
    </Link>
  )
}