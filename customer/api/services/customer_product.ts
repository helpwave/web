import { CustomerProductsHelper } from '@/api/dataclasses/customer_product'
import { API_URL } from '@/api/config'
import { ProductHelpers } from '@/api/dataclasses/product'

export type BookProductType = {
  product_uuid: string,
  product_plan_uuid: string,
  voucher_uuid?: string,
  accepted_contracts: string[],
}

export type PriceCalculationProps = {
  productUuid: string,
  productPlanUuid: string,
  voucherUuid?: string,
}

export type PriceCalculationResult = {
  finalPrice: number,
  beforePrice: number,
  saving: number,
}

export type CartPriceCalculationResult = {
  finalPrice: number,
  beforePrice: number,
  saving: number,
  products: Record<string, PriceCalculationResult>,
}

const PriceCalculationResultHelpers = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fromJson: (data: any): PriceCalculationResult => {
    return {
      finalPrice: data.final_price,
      beforePrice: data.before_price,
      saving: data.saving,
    }
  }
}

export const CustomerProductsAPI = {
  book: async (product: BookProductType, headers: HeadersInit) => {
    const response = await fetch(`${API_URL}/customer/product/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(product)
    })
    if (response.ok) {
      return ProductHelpers.fromJson(await response.json())
    }
    throw response
  },
  get: async (id: string, headers: HeadersInit) => {
    const response = await fetch(`${API_URL}/customer/product/${id}/`, {
      method: 'GET',
      headers,
    })
    if (response.ok) {
      return CustomerProductsHelper.fromJson(await response.json())
    }
    throw response
  },
  delete: async (id: string, headers: HeadersInit) => {
    const response = await fetch(`${API_URL}/customer/product/${id}`, {
      method: 'Delete',
      headers: { ...headers, 'Content-Type': 'application/json' },
    })
    if (response.ok) {
      return true
    }
    throw response
  },
  getAllForCustomer: async (headers: HeadersInit) => {
    const response = await fetch(`${API_URL}/customer/product/self/`, {
      method: 'GET',
      headers,
    })
    if (response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (await response.json() as any[]).map(value => CustomerProductsHelper.fromJsonResolvedCustomerProduct(value))
    }
    throw response
  },
  calculatePrice: async (product: PriceCalculationProps, headers: HeadersInit): Promise<PriceCalculationResult> => {
    const response = await fetch(`${API_URL}/customer/product/calculate/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({
        product_uuid: product.productUuid,
        product_plan_uuid: product.productPlanUuid,
        voucher_uuid: product.voucherUuid ?? null
      })
    })
    if (response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return PriceCalculationResultHelpers.fromJson(await response.json() as any)
    }
    throw response
  },
  calculatePrices: async (products: PriceCalculationProps[], headers: HeadersInit): Promise<CartPriceCalculationResult> => {
    const prices: CartPriceCalculationResult = {
      finalPrice: 0,
      beforePrice: 0,
      saving: 0,
      products: {},
    }
    for (const product of products) {
      const productPrice = await CustomerProductsAPI.calculatePrice(product, headers)
      prices.products[product.productUuid] = productPrice
      prices.beforePrice += productPrice.beforePrice
      prices.finalPrice += productPrice.finalPrice
      prices.saving += productPrice.saving
    }
    return prices
  },
}
