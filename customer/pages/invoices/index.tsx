import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { Section } from '@/components/layout/Section'
import { tw, tx } from '@twind/core'
import { LoadingAnimation } from '@helpwave/common/components/LoadingAnimation'
import { Table } from '@helpwave/common/components/Table'
import type { InvoiceStatusTranslation } from '@/api/dataclasses/invoice'
import { defaultInvoiceStatusTranslation } from '@/api/dataclasses/invoice'
import type { ProductPlanTranslation } from '@/api/dataclasses/product'
import { defaultProductPlanTranslation } from '@/api/dataclasses/product'
import {  withAuth } from '@/hooks/useAuth'
import { withOrganization } from '@/hooks/useOrganization'
import { useMyInvoicesQuery } from '@/api/mutations/invoice_mutations'
import EmbeddedCheckoutButton from '@/components/forms/StripeCheckOutForm'

type InvoicesTranslation = {
  invoices: string,
  payNow: string,
  invoiceNumber: string,
  createdAt: string,
  paymentStatus: string,
  paymentDate: string,
  actions: string,
  date: string,
  price: string,
  details: string,
  show: string,
  products: (amount: number) => string,
  plan: string,
} & InvoiceStatusTranslation & ProductPlanTranslation

const defaultInvoicesTranslations: Record<Languages, InvoicesTranslation> = {
  en: {
    ...defaultInvoiceStatusTranslation.en,
    ...defaultProductPlanTranslation.en,
    payNow: 'Pay Now',
    invoices: 'Invoices',
    invoiceNumber: 'Invoice Number',
    createdAt: 'Created At',
    paymentStatus: 'Payment Status',
    actions: 'Actions',
    paymentDate: 'Payment Date',
    date: 'Date',
    price: 'Price',
    details: 'Details',
    show: 'Show',
    products: (amount: number) => `${amount} ${amount === 1 ? 'Product' : 'Products'}`,
    plan: 'Plan',
  },
  de: {
    ...defaultInvoiceStatusTranslation.de,
    ...defaultProductPlanTranslation.de,
    invoices: 'Rechnungen',
    payNow: 'Jetzt Zahlen',
    invoiceNumber: 'Rechnungsnummer',
    createdAt: 'Erstellt Am',
    paymentStatus: 'Zahlungs Status',
    actions: 'Actionen',
    paymentDate: 'Zahlungs Datum',
    date: 'Datum',
    price: 'Preis',
    details: 'Details',
    show: 'Anzeigen',
    products: (amount: number) => `${amount} ${amount === 1 ? 'Produkt' : 'Produkte'}`,
    plan: 'Plan',

  }
}

type InvoicesServerSideProps = {
  jsonFeed: unknown,
}

const Invoices: NextPage<PropsForTranslation<InvoicesTranslation, InvoicesServerSideProps>> = ({ overwriteTranslation }) => {
  const translation = useTranslation(defaultInvoicesTranslations, overwriteTranslation)
  const { isError, isLoading, data } = useMyInvoicesQuery()

  return (
    <Page pageTitle={titleWrapper(translation.invoices)}>
      <Section titleText={translation.invoices}>
        {(isError) && (<span className={tw('There was an Error')}></span>)}
        {!isError && isLoading && (<LoadingAnimation/>)}
        {!isError && !isLoading && (
          <div className={tw('flex flex-wrap gap-x-8 gap-y-12')}>
            <Table
              className={tw('w-full h-full')}
              data={data}
              identifierMapping={dataObject => dataObject.uuid}
              header={[
                (<span key="date">{translation.date}</span>),
                (<span key="name">{translation.invoiceNumber}</span>),
                (<span key="price">{translation.price}</span>),
                (<span key="paymentStatus">{translation.paymentStatus}</span>),
                (<span key="paymentDate">{translation.paymentDate}</span>),
                (<span key="actions">{translation.actions}</span>),
              ]}
              rowMappingToCells={invoice => [
                (<span key={invoice.uuid + '-date'}>{invoice.date.toDateString()}</span>),
                (<span key={invoice.uuid + '-name'}>{invoice.uuid}</span>),
                (
                  <span key={invoice.uuid + '-price'} className={tw('font-semibold')}>
                    {invoice.totalAmount + '€'}
                  </span>
                ),
                (
                  <span
                    key={invoice.uuid + '-payment-status'}
                    className={tx({
                      'text-hw-negative-400': invoice.status === 'overdue',
                      'text-hw-warn-400': invoice.status === 'pending',
                      'text-hw-positive-400': invoice.status === 'payed'
                    })}
                  >
                    {translation[invoice.status]}
                  </span>
                ),
                (
                  <span key={invoice.uuid + '-payment-date'}>
                    {invoice.date?.toDateString() ?? '-'}
                  </span>
                ),
                invoice.status === 'overdue' || invoice.status === 'pending' ?
                  (
                    <EmbeddedCheckoutButton
                      key={invoice.uuid + '-pay'}
                      invoiceId={invoice.uuid}
                    >
                      {translation.payNow}
                    </EmbeddedCheckoutButton>
                  ) : (<div/>)
              ]}
            />
          </div>
        )}
      </Section>
    </Page>
  )
}

export default withAuth(withOrganization(Invoices))
