export type InvoiceStatus = 'payed' | 'pending' | 'notPayed'

export type Invoice = {
  uuid: string,
  name: string,
  creationDate: Date,
  status: InvoiceStatus,
  /** The day the payment was done */
  paymentDate?: Date,
  customerUUID: string,
}
