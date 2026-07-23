'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary'
type ButtonSize = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'rounded-full bg-[var(--color-brand)] text-m font-bold text-black transition-colors hover:bg-[var(--color-brand-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-text-primary)] focus-visible:outline-offset-2 cursor-pointer',
  secondary:
    'rounded-full bg-[var(--color-white)] border-2 border-[var(--color-brand)] text-m font-bold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-brand)]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-brand)] focus-visible:outline-offset-2 cursor-pointer',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-10 px-6',
  md: 'h-12 px-8',
}

const FOCUS_RING_COLORS: Record<ButtonVariant, string> = {
  primary: 'var(--color-text-primary)',
  secondary: 'var(--color-brand)',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, disabled, style, ...props }, ref) => {
    const baseClasses = 'flex items-center justify-center transition-colors cursor-pointer'
    const variantClass = VARIANT_CLASSES[variant]
    const sizeClass = SIZE_CLASSES[size]
    const disabledClass = disabled ? 'opacity-60 cursor-not-allowed' : ''

    return (
      <button
        ref={ref}
        {...props}
        disabled={disabled}
        style={{ ...style, outlineColor: FOCUS_RING_COLORS[variant] }}
        className={[baseClasses, variantClass, sizeClass, disabledClass, className ?? '']
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button