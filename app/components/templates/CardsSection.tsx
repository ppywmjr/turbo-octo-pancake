import type { ReactNode } from 'react'
import CardsGrid from '@/app/components/templates/CardsGrid'
import { SectionHeading } from '@/app/components/atoms/text'

export default function CardsSection({
  title,
  cards,
}: {
  title: string
  cards: ReactNode[]
}) {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading>{title}</SectionHeading>
      <CardsGrid>{cards}</CardsGrid>
    </section>
  )
}
