import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchPlanById } from '@/app/lib/plans'
import SubscribeButton from '@/app/components/SubscribeButton'
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
    <main className="flex flex-1 flex-col items-center justify-center py-24 px-8 bg-zinc-50 dark:bg-black min-h-screen">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            Subscribe
          </p>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{plan.name}</h1>
          {plan.description && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{plan.description}</p>
          )}
        </div>

        <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800 px-5 py-4">
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{formatPrice(plan)}</p>
          {plan.billingInterval && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Billed per {plan.billingInterval === 'yearly' ? 'year' : plan.billingInterval}</p>
          )}
        </div>

        <SubscribeButton planId={planId} />
      </div>
    </main>
  )
}
