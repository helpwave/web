export type CustomerProduct = {
  /** The identifier of the booking
   *
   *  undefined if creating
   */
  uuid: string,
  /** The identifier of the customer that booked the product */
  customerUUID: string,
  /** The identifier of the booked product */
  productUUID: string,
  /** The identifier of the plan for the booked product */
  productPlanUUID: string,
  /** The number of seats allocated */
  seats?: number,
  /** The date from which the booking starts */
  startDate: Date,
  /** The date on which the next payment is due */
  nextPaymentDate?: Date,
  /** The date from the booking ends */
  cancellationDate?: Date,
  /** The identifier of the voucher used to book the product */
  voucherUUID?: string,
  createdAt: Date,
  updatedAt: Date,
}
