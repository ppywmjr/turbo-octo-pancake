import { serverFetch } from '@/app/lib/serverFetch'
import type { Plan } from '@/app/types/plan'

export async function fetchAllPlans(): Promise<Plan[]> {
  const baseUrl = process.env.SUBSCRIPTION_MANAGEMENT_URL

  if (!baseUrl) {
    return []
  }

  const url = new URL('/plans', baseUrl)

  const res = await serverFetch(url.toString(), {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })

  if (!res.ok) {
    console.error(`[fetchAllPlans] Plans API responded with ${res.status}`)
    return []
  }

  const json = await res.json()
  const data = Array.isArray(json) ? json : (json.data ?? [])
  return (data as Plan[]).filter((p) => p.isActive)
}

export async function fetchPlanById(planId: string): Promise<Plan | null> {
  const plans = await fetchAllPlans()
  return plans.find((p) => p.id === planId) ?? null
}
