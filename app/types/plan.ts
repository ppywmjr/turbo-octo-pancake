export type BillingInterval = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface Plan {
  id: string
  name: string
  description: string | null
  isFree: boolean
  billingInterval: BillingInterval | null
  pricePence: number | null
  isActive: boolean
}

export interface PlansResponse {
  plans: Plan[]
}
