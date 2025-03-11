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
