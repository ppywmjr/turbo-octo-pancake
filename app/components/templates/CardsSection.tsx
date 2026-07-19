import type { ReactNode } from 'react'
import CardsGrid from '@/app/components/templates/CardsGrid'

export default function CardsSection({
  title,
  cards,
}: {
  title: string
  cards: ReactNode[]
}) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold tracking-tight text-[var(--color-zinc-900)]">
        {title}
      </h2>
      <CardsGrid>{cards}</CardsGrid>
    </section>
  )
}
