import type { NextPage } from 'next'
import { useLanguage, type Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { Section } from '@/components/layout/Section'
import { tw, tx } from '@twind/core'
import { LoadingAnimation } from '@helpwave/common/components/LoadingAnimation'
import { Table } from '@helpwave/common/components/Table'
import { Button } from '@helpwave/common/components/Button'
import type { InvoiceStatusTranslation } from '@/api/dataclasses/invoice'
import { defaultInvoiceStatusTranslation } from '@/api/dataclasses/invoice'
import type { ProductPlanTypeTranslation } from '@/api/dataclasses/product'
import { defaultProductPlanTypeTranslation } from '@/api/dataclasses/product'
import { withAuth } from '@/hooks/useAuth'
import { withOrganization } from '@/hooks/useOrganization'
import { useMyInvoicesQuery } from '@/api/mutations/invoice_mutations'
import EmbeddedCheckoutButton from '@/components/forms/StripeCheckOutForm'

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

const defaultInvoicesTranslations: Record<Languages, InvoicesTranslation> = {
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
    <div className={tx('px-4 py-2 rounded-full', {
      'bg-hw-positive-500 text-white': amount === 0,
      'bg-hw-negative-500 text-white': amount !== 0,
    })}>
      {amount !== 0 ? translation.outstandingPayments + ': ' : translation.allPayed}
      {amount !== 0 && amount + '€'}
    </div>
  )
}

const Invoices: NextPage<PropsForTranslation<InvoicesTranslation, InvoicesServerSideProps>> = ({ overwriteTranslation }) => {
  const translation = useTranslation(defaultInvoicesTranslations, overwriteTranslation)
  const { isError, isLoading, data } = useMyInvoicesQuery()
  const language = useLanguage()

  function formatDate(date?: Date) {
    if (date == null || date == undefined) {
      return null
    }

    const languageToLocaleMapping = {
      de: 'de-DE',
      en: 'en-US',
    }

    const locale = languageToLocaleMapping[language.language] || 'en-US'


    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: locale === 'en-US'
    }

    let formatted = date.toLocaleString(locale, options)

    if (locale === 'de-DE') {
      formatted = formatted.replace(/(\d{2}:\d{2})$/, '$1 Uhr')
    }

    return formatted
  }

  return (
    <Page pageTitle={titleWrapper(translation.invoices)}>
      <Section>
        <div className={tw('flex flex-row justify-between gap-x-2')}>
          <h2 className={tw('font-bold font-space text-3xl')}>{translation.invoices}</h2>
          {!isError && !isLoading && data && (
            <PaymentDisplay
              amount={data.filter(value => value.status !== 'paid').reduce((previousValue, currentValue) => previousValue + currentValue.totalAmount, 0)}/>
          )}
        </div>
        {(isError) && (<span className={tw('There was an Error')}></span>)}
        {!isError && isLoading && (<LoadingAnimation/>)}
        {!isError && !isLoading && data.length > 0 ? (
            <div className={tw('flex flex-wrap gap-x-8 gap-y-12')}>
              <Table
                className={tw('w-full h-full')}
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
                  (<span key={invoice.uuid + '-date'}>{formatDate(invoice.date)}</span>),
                  (<span key={invoice.uuid + '-name'}>{invoice.title}</span>),
                  (
                    <span key={invoice.uuid + '-price'} className={tw('font-semibold')}>
                    {invoice.totalAmount + '€'}
                  </span>
                  ),
                  (
                    <span
                      key={invoice.uuid + '-payment-status'}
                      className={tx('w-full px-4 py-2 rounded-full',{
                        'bg-hw-negative-500 text-white': invoice.status === 'overdue',
                        'bg-hw-warn-500 text-white': invoice.status === 'pending',
                        'bg-hw-positive-500 text-white': invoice.status === 'paid'
                      })}
                    >
                    {translation[invoice.status]}
                  </span>
                  ),
                  (
                    <span key={invoice.uuid + '-payment-date'}>
                    {invoice.status === 'paid' && invoice.createdAt != undefined ? formatDate(invoice.updatedAt) : '-'}
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
                          <Button
                            disabled={true}
                            variant="text-border"
                            className={tw('mr-2')}>
                            {translation[invoice.status]}
                          </Button>
                        ) :
                        (
                          <Button>
                            PDF
                          </Button>
                        )
                    )
                ]}
              />
            </div>
          ) :
          (
            <div className={tw('flex flex-row justify-center w-full text-gray-400')}>{translation.noInvoices}</div>
          )}
      </Section>
    </Page>
  )
}

export default withAuth(withOrganization(Invoices))
