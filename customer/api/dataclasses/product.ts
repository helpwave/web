import type { Translation } from '@helpwave/common/hooks/useTranslation'

export type ProductPlan = 'monthly' | 'yearly' | 'once';

export type ProductPlanTranslation = Record<ProductPlan, string>

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

export type Product = {
  uuid: string,
  name: string,
  price: number,
  plan: ProductPlan,
}
