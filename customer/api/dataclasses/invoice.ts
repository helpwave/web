export type Invoice = {
  uuid: string,
  name: string,
  creationDate: Date,
  /** The day the payment was done */
  paymentDate?: Date,
  customerUUID: string,
}
