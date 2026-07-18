import Link from 'next/link'
import type { Plan, BillingInterval } from '@/app/types/plan'
import Card from '@/app/components/atoms/Card'

function formatPlanPrice(plan: Plan): string {
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

export default function PlanCard({ plan }: { plan: Plan }) {
    return (
        <Card>
            <div className="flex flex-col flex-1 gap-3 p-4">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 leading-snug">
                    {plan.name}
                </h3>
                {plan.description && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 flex-1 line-clamp-3">
                        {plan.description}
                    </p>
                )}
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{formatPlanPrice(plan)}</p>
            </div>
            <div className="px-4 pb-4">
                <Link
                    href={`/subscribe/${plan.id}`}
                    className="flex h-12 w-full items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white transition-colors hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"
                >
                    Subscribe
                </Link>
            </div>
        </Card>
    )
}
