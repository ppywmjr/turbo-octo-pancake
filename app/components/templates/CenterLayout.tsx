import type { ReactNode } from 'react'

export default function CenterLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <main className="flex flex-1 flex-col items-center py-16 px-8 bg-[var(--color-zinc-50)] min-h-screen">
      <div className="w-full max-w-5xl flex flex-col gap-6">{children}</div>
    </main>
  )
}
