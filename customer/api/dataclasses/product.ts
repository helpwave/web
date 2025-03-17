import type { Translation } from '@helpwave/common/hooks/useTranslation'

export type ProductPlanType = 'monthly' | 'yearly' | 'once';

export type ProductPlanTranslation = Record<ProductPlanType, string>

export const defaultProductPlanTranslation: Translation<ProductPlanTranslation> = {
  en: {
    yearly: 'Yearly',
    once: 'Once',
    monthly: 'Monthly'
  },
  de: {
    yearly: 'Jährlich',
    once: 'Einmalig',
    monthly: 'Monatlich'
  }
}

export type ProductPlan = {
  uuid: string,
  type: ProductPlanType,
  costEuro: number,
  seatBased: boolean,
  createdAt: Date,
  updatedAt: Date,
}

export type Product = {
  uuid: string,
  name: string,
  description: string,
  plan: ProductPlan[],
  createdAt: Date,
  updatedAt: Date,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromJson(json: any): Product {
  return {
    uuid: json.uuid,
    name: json.name,
    description: json.description,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plan: json.plans.map((plan: any) => ({
      uuid: plan.uuid,
      type: plan.type,
      costEuro: plan.cost_euro,
      seatBased: plan.seat_based,
      createdAt: new Date(plan.created_at),
      updatedAt: new Date(plan.updated_at),
    })),
    createdAt: new Date(json.created_at),
    updatedAt: new Date(json.updated_at),
  }
}

export const ProductHelpers = { fromJson }
