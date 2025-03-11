export type Voucher = {
  uuid: string,
  description: string,
  productPlanUUID: string,
  discountPercentage?: number,
  discountFixedAmount?: number,
  valid: boolean,
}
