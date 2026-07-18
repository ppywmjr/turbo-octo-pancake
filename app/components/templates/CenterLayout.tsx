import type { ReactNode } from 'react'

export default function CenterLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <main className="flex flex-1 flex-col items-center py-16 px-8 bg-zinc-50 dark:bg-black min-h-screen">
      <div className="w-full max-w-5xl flex flex-col gap-10">{children}</div>
    </main>
  )
}
