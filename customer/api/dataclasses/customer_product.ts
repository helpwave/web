import type { Contract } from '@/api/dataclasses/contract'
import type { Product } from '@/api/dataclasses/product'

type CustomerProductStatus = 'booked' | 'booking' | 'canceled' | 'inCart'

export type CustomerProduct = {
  /** The identifier of the booking
   *
   *  undefined if creating
   */
  uuid?: string,
  /** The identifier of the booked product */
  productUUID: string,
  /** The identifier of the customer that booked the product */
  customerUUID: string,
  /** The date from which the booking starts */
  startDate: Date,
  /**
   * The date from the booking ends
   *
   * undefined if it is continuous
   */
  endDate?: Date,
  status: CustomerProductStatus,
  /** The contracts used for the booking */
  contracts: Contract[],
  /** The optionally loaded data of the product */
  product?: Product,
  // voucherCode: string,
}
