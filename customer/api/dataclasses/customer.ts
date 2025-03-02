import type { Address } from '@/api/dataclasses/address'
import type { CustomerProduct } from '@/api/dataclasses/customer_product'

export type CustomerProductExtension = { products: CustomerProduct[] }

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
