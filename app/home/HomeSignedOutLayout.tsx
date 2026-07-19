import type { ReactNode } from 'react'

export default function HomeSignedOutLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <main className="flex flex-1 flex-col items-center py-20 sm:py-28 px-8 bg-[var(--color-surface)] min-h-screen">
      <div className="w-full max-w-5xl flex flex-col gap-6">{children}</div>
    </main>
  )
}