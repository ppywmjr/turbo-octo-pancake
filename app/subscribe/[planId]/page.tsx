import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchPlanById } from '@/app/lib/plans'
import SubscribeButton from '@/app/components/molecules/SubscribeButton'
import CenterLayout from '@/app/components/templates/CenterLayout'
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
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-brand)]">
            Subscribe
          </p>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{plan.name}</h1>
          {plan.description && (
            <p className="text-sm text-[var(--color-text-muted)]">{plan.description}</p>
          )}
        </div>

        <div className="rounded-xl bg-[var(--color-surface)] px-5 py-4">
          <p className="text-3xl font-bold text-[var(--color-text-primary)]">{formatPrice(plan)}</p>
          {plan.billingInterval && (
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Billed per {plan.billingInterval === 'yearly' ? 'year' : plan.billingInterval}</p>
          )}
        </div>

        <SubscribeButton planId={planId} />
      </div>
    </CenterLayout>
  )
}
