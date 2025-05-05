import type { Translation } from '@helpwave/common/hooks/useTranslation'

export type InvoiceStatus = 'paid' | 'pending' | 'overdue'

export type InvoiceStatusTranslation = Record<InvoiceStatus, string>

export const defaultInvoiceStatusTranslation: Translation<InvoiceStatusTranslation> = {
  en: {
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue',
  },
  de: {
    paid: 'Bezahlt',
    pending: 'In Arbeit',
    overdue: 'Überfällig',
  }
}

export type Invoice = {
  /** The identifier of the Invoice */
  uuid: string,
  /** The status of the Invoice */
  status: InvoiceStatus,
  /** The optional title of the Invoice */
  title: string,
  /** The date when the Invoice should be paid issued */
  date: Date,
  /** The total amount to pay */
  totalAmount: number,
  /** The day the Invoice was created */
  createdAt?: Date,
  /** The day the Invoice or its status was last changed */
  updatedAt?: Date,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromJson(json: any): Invoice {
  return {
    uuid: json.uuid,
    status: json.status,
    title: json.title ?? '',
    date: new Date(json.date),
    totalAmount: json.total_amount,
    createdAt: json.created_at ? new Date(json.created_at) : undefined,
    updatedAt: json.updated_at ? new Date(json.updated_at) : undefined,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toJson(invoice: Invoice): any {
  return {
    uuid: invoice.uuid,
    status: invoice.status,
    date: invoice.date.toISOString(),
    total_amount: invoice.totalAmount,
    created_at: invoice.createdAt?.toISOString(),
    updated_at: invoice.updatedAt?.toISOString(),
  }
}

export const InvoiceHelpers = { fromJson, toJson }
