import type { Product } from '@/api/dataclasses/product'
import type { Translation } from '@helpwave/common/hooks/useTranslation'

export type InvoiceStatus = 'payed' | 'pending' | 'notPayed' | 'overdue'

export type InvoiceStatusTranslation = Record<InvoiceStatus, string>

export const defaultInvoiceStatusTranslation: Translation<InvoiceStatusTranslation> = {
  en: {
    payed: 'Payed',
    pending: 'Pending',
    notPayed: 'Not Payed',
    overdue: 'Overdue',
  },
  de: {
    payed: 'Bezahlt',
    pending: 'In Arbeit',
    notPayed: 'Nicht bezahlt',
    overdue: 'Überfällig',
  }
}

export type Invoice = {
  /** The identifier of the Invoice */
  uuid: string,
  /** The identifier of the customer which receives the Invoice */
  customerUUID: string,
  /** The name of the Invoice */
  name: string,
  /** The date when the Invoice was issued */
  date: Date,
  /** The status of the Invoice */
  status: InvoiceStatus,
  /** The day the payment was done */
  paymentDate?: Date,
  /** Optionally loaded extension of products that form the invoice */
  products?: Product[],
}
