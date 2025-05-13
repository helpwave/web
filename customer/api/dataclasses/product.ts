import type { Translation } from '@helpwave/hightide/hooks/useTranslation'

export type ProductPlanType = 'once' | 'recurring' | 'lifetime' | 'trial';

export type ProductPlanTypeTranslation = Record<ProductPlanType, string>

export const defaultProductPlanTypeTranslation: Translation<ProductPlanTypeTranslation> = {
  en: {
    once: 'Once',
    recurring: 'Recurring',
    lifetime: 'Lifetime',
    trial: 'Trial',
  },
  de: {
    once: 'Einmalig',
    recurring: 'Wiederholend',
    lifetime: 'Lebenszeit',
    trial: 'Testphase',
  }
}

export type ProductPlanTranslation = { productPlan: (plan: ProductPlan) => string }

export const defaultProductPlanTranslation: Translation<ProductPlanTranslation> = {
  en: {
    productPlan: value => {
      if(value.type !== 'recurring') {
        return defaultProductPlanTypeTranslation.en[value.type]
      }
      if(value.recurringMonth === 1) {
        return 'Monthly'
      } else if (value.recurringMonth === 12) {
        return 'Yearly'
      }
      return `Every ${value} Months`
    }
  },
  de: {
    productPlan: value => {
      if(value.type !== 'recurring') {
        return defaultProductPlanTypeTranslation.de[value.type]
      }
      if(value.recurringMonth === 1) {
        return 'Monatlich'
      } else if (value.recurringMonth === 12) {
        return 'Jährlich'
      }
      return `Alle ${value} Monate`
    }
  }
}

export type ProductPlan = {
  uuid: string,
  type: ProductPlanType,
  costEuro: number,
  recurringMonth: number,
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
function fromJsonProductPlan(json: any): ProductPlan {
  return {
      uuid: json.uuid,
      type: json.type,
      costEuro: json.cost_euro,
      seatBased: json.seat_based,
      recurringMonth: json.recurring_month,
      createdAt: new Date(json.created_at),
      updatedAt: new Date(json.updated_at),
  }
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
      recurringMonth: plan.recurring_month,
      createdAt: new Date(plan.created_at),
      updatedAt: new Date(plan.updated_at),
    })),
    createdAt: new Date(json.created_at),
    updatedAt: new Date(json.updated_at),
  }
}

export const ProductHelpers = { fromJson, fromJsonProductPlan }
