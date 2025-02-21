import type { Address } from '@/api/dataclasses/address';
import type { ActiveProduct } from '@/api/dataclasses/active_product';

export type CustomerProductExtension = { products: ActiveProduct[] }

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
