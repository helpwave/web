import type { Address } from '@/api/dataclasses/address';

export type Customer = {
  uuid: string,
  name: string,
  creationDate: Date,
  address: Address,
  email: string,
  phoneNumber: string,
  websiteURL?: string,
}
