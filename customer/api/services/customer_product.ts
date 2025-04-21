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

type CartPriceCalculationBackendResponseType = {
  overall: {
    final_price: number,
    before_price: number,
    saving: number,
  },
  products: {
    product_uuid: string,
    calculation: {
      final_price: number,
      before_price: number,
      saving: number,
    },
  }[],
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
  calculatePrice: async (productList: PriceCalculationProps[], headers: HeadersInit): Promise<CartPriceCalculationResult> => {
    const response = await fetch(`${API_URL}/customer/product/calculate/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(productList.map(product => ({
        product_uuid: product.productUuid,
        product_plan_uuid: product.productPlanUuid,
        voucher_uuid: product.voucherUuid ?? null
      })))
    })
    if (response.ok) {
      const json = await response.json() as CartPriceCalculationBackendResponseType
      const products: Record<string, PriceCalculationResult> = {}
      for (const product of json.products) {
        products[product.product_uuid] = {
          finalPrice: product.calculation.final_price,
          beforePrice: product.calculation.before_price,
          saving: product.calculation.saving,
        }
      }
      return {
        finalPrice: json.overall.final_price,
        beforePrice: json.overall.before_price,
        saving: json.overall.saving,
        products,
      }
    }
    throw response
  },
}
