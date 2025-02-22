export type BookedProduct = {
  /** The identifier of the booking */
  uuid: string,
  /** The identifier of the booked product */
  productUUID: string,
  /** The identifier of the customer that booked the product */
  customerUUID: string,
  /** The date from which the booking starts */
  startDate: Date,
  /**
   * The date from the booking ends
   *
   * undefined if it is continuous
   */
  endDate?: Date,
  /** The contract version used for the booking */
  contractVersion: string,
  // voucherCode: string,
}
