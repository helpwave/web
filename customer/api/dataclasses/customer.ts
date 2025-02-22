import type { Address } from '@/api/dataclasses/address'
import type { BookedProduct } from '@/api/dataclasses/booked_product'

export type CustomerProductExtension = { products: BookedProduct[] }

export type Customer = {
  uuid: string,
  name: string,
  creationDate: Date,
  address: Address,
  email: string,
  phoneNumber: string,
  /** Optional Website URL */
  websiteURL?: string,
  /** Extension that might or might not be loaded */
  productsExtension?: CustomerProductExtension,
}
