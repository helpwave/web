import type { Product, ProductPlan } from '@/api/dataclasses/product'
import { ProductHelpers } from '@/api/dataclasses/product'
import type { Translation } from '@helpwave/common/hooks/useTranslation'

export type CustomerProductStatus =
  'trialing'
  | 'active'
  | 'activation'
  | 'payment'
  | 'scheduled'
  | 'canceled'
  | 'expired'
  | 'refunded'

export type CustomerProductStatusTranslation = Record<CustomerProductStatus, string>

export const defaultCustomerProductStatusTranslation : Translation<CustomerProductStatusTranslation> = {
  en: {
    trialing: 'Trialing',
    active: 'Active',
    activation: 'Activation Required',
    payment: 'Awaiting Payment',
    scheduled: 'Scheduled Cancelation',
    canceled: 'Canceled',
    expired: 'Expired',
    refunded: 'Refunded'
  },
  de: {
    trialing: 'Testphase',
    active: 'Aktiv',
    activation: 'Aktivierung erforderlich',
    payment: 'Zahlung ausstehend',
    scheduled: 'Geplante Kündingung',
    canceled: 'Kündigung',
    expired: 'Abgelaufen',
    refunded: 'Erstattet'
  }
}

export interface CustomerProduct {
  /** The identifier of the booking
   *
   *  undefined if creating
   */
  uuid: string,
  /** The identifier of the customer that booked the product */
  customerUUID: string,
  /** The identifier of the booked product */
  productUUID: string,
  /** The identifier of the plan for the booked product */
  productPlanUUID: string,
  /** The status of the booking */
  status: CustomerProductStatus,
  /** The number of seats allocated */
  seats?: number,
  /** The date from which the booking starts */
  startDate: Date,
  /** The date on which the next payment is due */
  nextPaymentDate?: Date,
  /** The date from the booking ends */
  cancellationDate?: Date,
  /** The identifier of the voucher used to book the product */
  voucherUUID?: string,
  createdAt: Date,
  updatedAt: Date,
}

export interface CustomerProductCreate {
  /** The identifier of the booked product */
  productUUID: string,
  /** The identifier of the plan for the booked product */
  productPlanUUID: string,
  /** The identifier of the voucher used to book the product */
  voucherUUID?: string,
}

export interface ResolvedCustomerProduct {
  /** The identifier of the booking
   *
   *  undefined if creating
   */
  uuid: string,
  /** The identifier of the customer that booked the product */
  customerUUID: string,
  /** The status of the booking */
  status: CustomerProductStatus,
  /** The number of seats allocated */
  seats?: number,
  /** The date from which the booking starts */
  startDate: Date,
  /** The date on which the next payment is due */
  nextPaymentDate?: Date,
  /** The date from the booking ends */
  cancellationDate?: Date,
  /** The identifier of the voucher used to book the product */
  voucherUUID?: string,
  createdAt: Date,
  updatedAt: Date,
  product: Product,
  productPlan: ProductPlan,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromJson(json: any): CustomerProduct {
  return {
    uuid: json.uuid,
    customerUUID: json.customer_uuid,
    productUUID: json.product_uuid,
    productPlanUUID: json.product_plan_uuid,
    status: json.status,
    seats: json.seats,
    startDate: new Date(json.start_date),
    nextPaymentDate: json.next_payment_date ? new Date(json.next_payment_date) : undefined,
    cancellationDate: json.cancellation_date ? new Date(json.cancellation_date) : undefined,
    voucherUUID: json.voucher_uuid,
    createdAt: new Date(json.created_at),
    updatedAt: new Date(json.updated_at),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromJsonResolvedCustomerProduct(json: any): ResolvedCustomerProduct {
  return {
    uuid: json.uuid,
    customerUUID: json.customer_uuid,
    status: json.status,
    seats: json.seats,
    startDate: new Date(json.start_date),
    nextPaymentDate: json.next_payment_date ? new Date(json.next_payment_date) : undefined,
    cancellationDate: json.cancellation_date ? new Date(json.cancellation_date) : undefined,
    voucherUUID: json.voucher_uuid,
    createdAt: new Date(json.created_at),
    updatedAt: new Date(json.updated_at),
    productPlan: ProductHelpers.fromJsonProductPlan(json.product_plan),
    product: ProductHelpers.fromJson(json.product)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toJson(customerProduct: CustomerProduct): any {
  return {
    uuid: customerProduct.uuid,
    customer_uuid: customerProduct.customerUUID,
    product_uuid: customerProduct.productUUID,
    product_plan_uuid: customerProduct.productPlanUUID,
    status: customerProduct.status,
    seats: customerProduct.seats,
    start_date: customerProduct.startDate.toISOString(),
    next_payment_date: customerProduct.nextPaymentDate?.toISOString(),
    cancellation_date: customerProduct.cancellationDate?.toISOString(),
    voucher_uuid: customerProduct.voucherUUID,
    created_at: customerProduct.createdAt.toISOString(),
    updated_at: customerProduct.updatedAt.toISOString(),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toJsonCreate(customerProduct: CustomerProductCreate): any {
  return {
    product_uuid: customerProduct.productUUID,
    product_plan_uuid: customerProduct.productPlanUUID,
    voucher_uuid: customerProduct.voucherUUID,
  }
}

export const CustomerProductsHelper = { toJson, toJsonCreate, fromJson, fromJsonResolvedCustomerProduct }
