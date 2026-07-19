import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchPlanById } from '@/app/lib/plans'
import SubscribeButton from '@/app/components/molecules/SubscribeButton'
import CenterLayout from '@/app/components/templates/CenterLayout'
import { PageLabel, BodyText, PriceText, BillingInfo, SectionHeading } from '@/app/components/atoms/text'
import type { Plan, BillingInterval } from '@/app/types/plan'

function formatPrice(plan: Plan): string {
  if (plan.isFree) return 'Free'
  if (plan.pricePence === null) return 'Contact us'

  const pounds = plan.pricePence / 100
  const formatted = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(pounds)

  const intervalLabel: Record<BillingInterval, string> = {
    daily: 'day',
    weekly: 'week',
    monthly: 'month',
    yearly: 'year',
  }

  const interval = plan.billingInterval ? ` / ${intervalLabel[plan.billingInterval]}` : ''
  return `${formatted}${interval}`
}

function formatBillingInterval(interval: BillingInterval): string {
  return interval === 'yearly' ? 'year' : interval
}

export default async function SubscribePage({
  params,
}: {
  params: Promise<{ planId: string }>
}) {
  const { planId } = await params

  const { userId } = await auth()
  if (!userId) {
    redirect(`/?error=unauthorized`)
  }

  const plan = await fetchPlanById(planId)
  if (!plan) {
    redirect('/?error=plan_not_found')
  }

  return (
    <CenterLayout>
      <div className="w-full max-w-md bg-[var(--color-white)] rounded-2xl border border-[var(--color-surface)] shadow-sm p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <PageLabel>Subscribe</PageLabel>
          <SectionHeading>{plan.name}</SectionHeading>
          {plan.description && (
            <BodyText muted>{plan.description}</BodyText>
          )}
        </div>

        <div className="rounded-xl bg-[var(--color-surface)] px-5 py-4">
          <PriceText size="large">{formatPrice(plan)}</PriceText>
          {plan.billingInterval && (
            <BillingInfo>Billed per {formatBillingInterval(plan.billingInterval)}</BillingInfo>
          )}
        </div>

        <SubscribeButton planId={planId} />
      </div>
    </CenterLayout>
  )
}
