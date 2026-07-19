import Link from 'next/link'
import type { Plan, BillingInterval } from '@/app/types/plan'
import Card from '@/app/components/atoms/Card'
import { CardTitle, BodyText, PriceText } from '@/app/components/atoms/text'

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
                <CardTitle as="h3">{plan.name}</CardTitle>
                {plan.description && (
                    <BodyText muted lineClamp={3} className="flex-1">
                        {plan.description}
                    </BodyText>
                )}
                <PriceText>{formatPlanPrice(plan)}</PriceText>
            </div>
            <div className="px-4 pb-4">
                <Link
                    href={`/subscribe/${plan.id}`}
                    className="flex h-12 w-full items-center justify-center rounded-full bg-[var(--color-brand)] text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-brand)]"
                >
                    Subscribe
                </Link>
            </div>
        </Card>
    )
}
