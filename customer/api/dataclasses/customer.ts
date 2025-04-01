export interface CustomerCreate {
  name: string,
  email: string,
  phoneNumber: string,
  /** Optional Website URL */
  websiteURL?: string,
  /** The street of the address */
  address?: string,
  /** The house number of the address */
  houseNumber?: string,
  /** The addition to the address of the person taking care of receiving mails */
  careOf?: string,
  /** The postal code of the address */
  postalCode?: string,
  /** The city of the address */
  city?: string,
  /** The country of the address */
  country?: string,
}

export interface Customer {
  uuid: string,
  name: string,
  email: string,
  phoneNumber: string,
  /** Optional Website URL */
  websiteURL?: string,
  /** The street of the address */
  address?: string,
  /** The house number of the address */
  houseNumber?: string,
  /** The addition to the address of the person taking care of receiving mails */
  careOf?: string,
  /** The postal code of the address */
  postalCode?: string,
  /** The city of the address */
  city?: string,
  /** The country of the address */
  country?: string,
  createdAt: Date,
  updatedAt: Date,
}

/**
 * Converts a JSON object to a Customer object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromJson = (json: any): Customer => {
  return {
    uuid: json.uuid,
    name: json.name,
    email: json.email,
    phoneNumber: json.phone_number,
    websiteURL: json.website_url,
    address: json.address,
    houseNumber: json.house_number,
    careOf: json.care_of,
    postalCode: json.postal_code,
    city: json.city,
    country: json.country,
    createdAt: new Date(json.created_at),
    updatedAt: new Date(json.updated_at),
  }
}

/**
 * Converts a Customer object back to JSON.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toJson = (customer: Customer): Record<string, any> => {
  return {
    uuid: customer.uuid,
    name: customer.name,
    email: customer.email,
    phone_number: customer.phoneNumber,
    website_url: customer.websiteURL,
    address: customer.address,
    house_number: customer.houseNumber,
    care_of: customer.careOf,
    postal_code: customer.postalCode,
    city: customer.city,
    country: customer.country,
    created_at: customer.createdAt.toISOString(),
    updated_at: customer.updatedAt.toISOString(),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toJsonUpdate = (customer: Customer): Record<string, any> => {
  return {
    name: customer.name,
    email: customer.email,
    phone_number: customer.phoneNumber,
    website_url: customer.websiteURL,
    address: customer.address,
    house_number: customer.houseNumber,
    care_of: customer.careOf,
    postal_code: customer.postalCode,
    city: customer.city,
    country: customer.country,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toJsonCreate = (customer: CustomerCreate): Record<string, any> => {
  return {
    name: customer.name,
    email: customer.email,
    phone_number: customer.phoneNumber,
    website_url: customer.websiteURL,
    address: customer.address,
    house_number: customer.houseNumber,
    care_of: customer.careOf,
    postal_code: customer.postalCode,
    city: customer.city,
    country: customer.country,
  }
}

export const CustomerHelpers = { fromJson, toJson, toJsonUpdate, toJsonCreate }

