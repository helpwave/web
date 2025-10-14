import type { NextPage } from 'next'
import { type Translation } from '@helpwave/hightide'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { Section } from '@/components/layout/Section'
import clsx from 'clsx'
import { LoadingAnimation } from '@helpwave/hightide'
import { Table } from '@helpwave/hightide'
import type { InvoiceStatusTranslation } from '@/api/dataclasses/invoice'
import { defaultInvoiceStatusTranslation } from '@/api/dataclasses/invoice'
import type { ProductPlanTypeTranslation } from '@/api/dataclasses/product'
import { defaultProductPlanTypeTranslation } from '@/api/dataclasses/product'
import { withAuth } from '@/hooks/useAuth'
import { withOrganization } from '@/hooks/useOrganization'
import { useMyInvoicesQuery } from '@/api/mutations/invoice_mutations'
import EmbeddedCheckoutButton from '@/components/forms/StripeCheckOutForm'
import { defaultLocaleFormatters } from '@/utils/locale'
import { TextButton } from '@helpwave/hightide'

type InvoicesTranslation = {
  invoices: string,
  payNow: string,
  title: string,
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
  noInvoices: string,
  outstandingPayments: string,
  allPayed: string,
} & InvoiceStatusTranslation & ProductPlanTypeTranslation

const defaultInvoicesTranslations: Translation<InvoicesTranslation> = {
  en: {
    ...defaultInvoiceStatusTranslation.en,
    ...defaultProductPlanTypeTranslation.en,
    payNow: 'Pay',
    invoices: 'Invoices',
    title: 'Name',
    createdAt: 'Created At',
    paymentStatus: 'Status',
    actions: 'Actions',
    paymentDate: 'Payment Date',
    date: 'Date',
    price: 'Price',
    details: 'Details',
    show: 'Show',
    products: (amount: number) => `${amount} ${amount === 1 ? 'Product' : 'Products'}`,
    plan: 'Plan',
    noInvoices: 'No Invoices',
    outstandingPayments: 'Outstanding Payments',
    allPayed: 'All payed up',
  },
  de: {
    ...defaultInvoiceStatusTranslation.de,
    ...defaultProductPlanTypeTranslation.de,
    invoices: 'Rechnungen',
    payNow: 'Bezahlen',
    title: 'Name',
    createdAt: 'Erstellt Am',
    paymentStatus: 'Status',
    actions: 'Aktion',
    paymentDate: 'Zahlungsdatum',
    date: 'Datum',
    price: 'Preis',
    details: 'Details',
    show: 'Anzeigen',
    products: (amount: number) => `${amount} ${amount === 1 ? 'Produkt' : 'Produkte'}`,
    plan: 'Plan',
    noInvoices: 'Keine Rechnungen',
    outstandingPayments: 'Ausstehende Zahlungen',
    allPayed: 'Alles bezahlt',
  }
}

type InvoicesServerSideProps = {
  jsonFeed: unknown,
}

type PaymentDisplayProps = {
  amount: number,
}

const PaymentDisplay = ({ amount }: PaymentDisplayProps) => {
  const translation = useTranslation(defaultInvoicesTranslations)

  return (
    <div className={clsx('px-4 py-2 rounded-full', {
      'bg-positive text-on-positive': amount === 0,
      'bg-negative text-on-negative': amount !== 0,
    })}>
      {amount !== 0 ? translation.outstandingPayments + ': ' : translation.allPayed}
      {amount !== 0 && amount + '€'}
    </div>
  )
}

const Invoices: NextPage<PropsForTranslation<InvoicesTranslation, InvoicesServerSideProps>> = ({ overwriteTranslation }) => {
  const translation = useTranslation(defaultInvoicesTranslations, overwriteTranslation)
  const localeTranslation = useTranslation(defaultLocaleFormatters)

  const { isError, isLoading, data } = useMyInvoicesQuery()

  return (
    <Page pageTitle={titleWrapper(translation.invoices)}>
      <Section>
        <div className="row justify-between">
          <h2 className="font-bold font-space text-3xl">{translation.invoices}</h2>
          {!isError && !isLoading && data && (
            <PaymentDisplay
              amount={data.filter(value => value.status !== 'paid').reduce((previousValue, currentValue) => previousValue + currentValue.totalAmount, 0)} />
          )}
        </div>
        {(isError) && (<span>{'There was an Error'}</span>)}
        {!isError && isLoading && (<LoadingAnimation />)}
        {!isError && !isLoading && data.length > 0 ? (
          <div className="flex flex-wrap gap-x-8 gap-y-12">
            <Table
              className="w-full h-full"
              data={data}
              identifierMapping={dataObject => dataObject.uuid}
              header={[
                (<span key="date">{translation.date}</span>),
                (<span key="name">{translation.title}</span>),
                (<span key="price">{translation.price}</span>),
                (<span key="paymentStatus">{translation.paymentStatus}</span>),
                (<span key="paymentDate">{translation.paymentDate}</span>),
                (<span key="actions">{translation.actions}</span>),
              ]}
              rowMappingToCells={invoice => [
                (<span key={invoice.uuid + '-date'}>{localeTranslation.formatDate(invoice.date)}</span>),
                (<span key={invoice.uuid + '-name'}>{invoice.title}</span>),
                (
                  <span key={invoice.uuid + '-price'} className="font-semibold">
                    {localeTranslation.formatMoney(invoice.totalAmount)}
                  </span>
                ),
                (
                  <span
                    key={invoice.uuid + '-payment-status'}
                    className={clsx('w-full px-4 py-2 rounded-full', {
                      'bg-negative text-on-negative': invoice.status === 'overdue',
                      'bg-warning text-on-warning': invoice.status === 'pending',
                      'bg-positive text-on-positive': invoice.status === 'paid'
                    })}
                  >
                    {translation[invoice.status]}
                  </span>
                ),
                (
                  <span key={invoice.uuid + '-payment-date'}>
                    {invoice.status === 'paid' && invoice.createdAt != undefined ? localeTranslation.formatDate(invoice.updatedAt) : '-'}
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
                  ) : (
                    invoice.status !== 'paid' ?
                      (
                        <TextButton disabled={true} className="mr-2">
                          {translation[invoice.status]}
                        </TextButton>
                      ) :
                      (
                        <TextButton>
                          PDF
                        </TextButton>
                      )
                  )
              ]}
            />
          </div>
        ) :
          (
            <div className="row justify-center w-full text-gray-400">{translation.noInvoices}</div>
          )}
      </Section>
    </Page>
  )
}

export default withAuth(withOrganization(Invoices))
