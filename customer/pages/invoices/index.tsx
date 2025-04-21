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
import {  withAuth } from '@/hooks/useAuth'
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
  }
}

type InvoicesServerSideProps = {
  jsonFeed: unknown,
}

const Invoices: NextPage<PropsForTranslation<InvoicesTranslation, InvoicesServerSideProps>> = ({ overwriteTranslation }) => {
  const translation = useTranslation(defaultInvoicesTranslations, overwriteTranslation)
  const { isError, isLoading, data } = useMyInvoicesQuery()
  const language = useLanguage()

  function formatDate(date: Date) {
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
                    className={tx({
                      'text-hw-negative-400': invoice.status === 'overdue',
                      'text-hw-warn-400': invoice.status === 'pending',
                      'text-hw-positive-400': invoice.status === 'paid'
                    })}
                  >
                    {translation[invoice.status]}
                  </span>
                ),
                (
                  <span key={invoice.uuid + '-payment-date'}>
                    {formatDate(invoice.date) ?? '-'}
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
                    <>
                      <Button
                        disabled={true}
                        variant="text-border"
                        className={tw('mr-2')}>
                        {translation[invoice.status]}
                      </Button>
                      <Button variant="text-border">
                        PDF
                      </Button>
                    </>
                  )
              ]}
            />
          </div>
        )}
      </Section>
    </Page>
  )
}

export default withAuth(withOrganization(Invoices))
