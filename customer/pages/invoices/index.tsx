import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { Section } from '@/components/layout/Section'
import { useInvoiceQuery } from '@/api/mutations/invoice_mutations'
import { tw, tx } from '@twind/core'
import { LoadingAnimation } from '@helpwave/common/components/LoadingAnimation'
import { Table } from '@helpwave/common/components/Table'
import { Button } from '@helpwave/common/components/Button'
import type { InvoiceStatus } from '@/api/dataclasses/invoice'

type InvoicesTranslation = {
  invoices: string,
  payed: string,
  notPayed: string,
  payNow: string,
  name: string,
  createdAt: string,
  paymentStatus: string,
  paymentDate: string,
  actions: string,
} & Record<InvoiceStatus, string>

const defaultInvoicesTranslations: Record<Languages, InvoicesTranslation> = {
  en: {
    invoices: 'Invoices',
    payed: 'Payed',
    pending: 'Pending',
    notPayed: 'Not Payed',
    payNow: 'Pay Now',
    name: 'Name',
    createdAt: 'Created At',
    paymentStatus: 'Payment Status',
    actions: 'Actions',
    paymentDate: 'Payment Date',
  },
  de: {
    invoices: 'Rechnungen',
    payed: 'Bezahlt',
    pending: 'In Arbeit',
    notPayed: 'Nicht bezahlt',
    payNow: 'Jetzt Zahlen',
    name: 'Name',
    createdAt: 'Erstellt Am',
    paymentStatus: 'Zahlungs Status',
    actions: 'Actionen',
    paymentDate: 'Zahlungs Datum'
  }
}

type InvoicesServerSideProps = {
  jsonFeed: unknown,
}

const Invoices: NextPage<PropsForTranslation<InvoicesTranslation, InvoicesServerSideProps>> = ({ overwriteTranslation }) => {
  const translation = useTranslation(defaultInvoicesTranslations, overwriteTranslation)
  const { isError, isLoading, data } = useInvoiceQuery()

  return (
    <Page pageTitle={titleWrapper(translation.invoices)}>
      <Section>
        {isError && (<span className={tw('There was an Error')}></span>)}
        {!isError && isLoading && (<LoadingAnimation/>)}
        {!isError && !isLoading && (
          <div className={tw('flex flex-wrap gap-x-8 gap-y-12')}>
            <Table
              className={tw('w-full h-full')}
              data={data}
              identifierMapping={dataObject => dataObject.uuid}
              header={[
                (<span key="name">{translation.name}</span>),
                (<span key="creationDate">{translation.createdAt}</span>),
                (<span key="paymentStatus">{translation.paymentStatus}</span>),
                (<span key="paymentStatus">{translation.paymentDate}</span>),
                (<span key="actions">{translation.actions}</span>),
              ]}
              rowMappingToCells={dataObject => [
                (<span key={dataObject.uuid + '-name'} className={tw('font-semibold')}>{dataObject.name}</span>),
                (<span key={dataObject.uuid + '-date'}>{dataObject.creationDate.toDateString()}</span>),
                (
                  <span
                    key={dataObject.uuid + '-payment-status'}
                    className={tx({
                      'text-hw-negative-400': dataObject.status === 'notPayed',
                      'text-hw-warn-400': dataObject.status === 'pending',
                      'text-hw-positive-400': dataObject.status === 'payed'
                    })}
                  >
                    {translation[dataObject.status]}
                  </span>
                ),
                (
                  <span key={dataObject.uuid + '-payment-date'}>
                    {dataObject.paymentDate?.toDateString() ?? '-'}
                  </span>
                ),
                (
                  <Button key={dataObject.uuid + '-pay'} disabled={!!dataObject.paymentDate}>
                    {translation.payNow}
                  </Button>
                )
              ]}
            />
          </div>
        )}
      </Section>
    </Page>
  )
}

export default Invoices
