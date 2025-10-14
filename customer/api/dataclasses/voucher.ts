export type Voucher = {
  uuid: string,
  code: string,
  description: string,
  productPlanUUID: string,
  discountPercentage?: number,
  discountFixedAmount?: number,
  valid: boolean,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromJson(json: any): Voucher {
  return {
    uuid: json.uuid,
    code: json.code,
    description: json.description,
    productPlanUUID: json.product_plan_uuid,
    discountPercentage: json.discount_percentage,
    discountFixedAmount: json.discount_fixed_amount,
    valid: json.valid,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toJson(voucher: Voucher): any {
  return {
    uuid: voucher.uuid,
    description: voucher.description,
    product_plan_uuid: voucher.productPlanUUID,
    discount_percentage: voucher.discountPercentage,
    discount_fixed_amount: voucher.discountFixedAmount,
    valid: voucher.valid,
  }
}

export const VoucherHelpers = { toJson, fromJson }
