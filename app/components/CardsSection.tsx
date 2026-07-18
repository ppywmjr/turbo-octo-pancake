import type { ReactNode } from 'react'

export default function CardsSection({
  title,
  cards,
}: {
  title?: string
  cards: ReactNode[]
}) {
  return (
    <section className="flex flex-col gap-6">
      {title && (
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
      )}
      <CardsGrid>{cards}</CardsGrid>
    </section>
  )
}

export function CardsGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  )
}
