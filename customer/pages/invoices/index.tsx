import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { Section } from '@/components/layout/Section'
import { useInvoiceQuery } from '@/api/mutations/invoice_mutations'
import clsx from 'clsx'
import { LoadingAnimation } from '@helpwave/common/components/LoadingAnimation'
import { Table } from '@helpwave/common/components/Table'
import { SolidButton } from '@helpwave/common/components/Button'
import type { InvoiceStatusTranslation } from '@/api/dataclasses/invoice'
import { defaultInvoiceStatusTranslation } from '@/api/dataclasses/invoice'
import { useState } from 'react'
import { Modal } from '@helpwave/common/components/modals/Modal'
import type { ProductPlanTranslation } from '@/api/dataclasses/product'
import { defaultProductPlanTranslation } from '@/api/dataclasses/product'
import { ChevronRight } from 'lucide-react'

type InvoicesTranslation = {
  invoices: string,
  payNow: string,
  name: string,
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
    name: 'Name',
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
    name: 'Name',
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
  const { isError, isLoading, data } = useInvoiceQuery()
  const [detailModalId, setDetailModalId] = useState<string>() // undefined means not used

  const hasNecessaryExtensions = data?.every(value => value.products != undefined) ?? false
  const detailModalObject = data?.find(value => value.uuid === detailModalId)

  return (
    <Page pageTitle={titleWrapper(translation.invoices)}>
      <Modal
        id="invoice-detail-modal"
        modalClassName="min-w-[600px]"
        isOpen={!!detailModalObject}
        titleText={`${translation.details}: ${detailModalObject?.name}`}
        onCloseClick={() => setDetailModalId(undefined)}
        onBackgroundClick={() => setDetailModalId(undefined)}
      >
        {!!detailModalObject?.products && (
          <Table
            data={detailModalObject!.products!}
            identifierMapping={dataObject => dataObject.uuid}
            rowMappingToCells={dataObject => [
              (<span key={dataObject.name + '-name'} className={clsx('semi-bold')}>{dataObject.name}</span>),
              (<span key={dataObject.name + '-price'}>{dataObject.price.toFixed(2) + '€'}</span>),
              (<span key={dataObject.plan + '-plan'}>{translation[dataObject.plan]}</span>),
            ]}
            header={[
              (<span key="name">{translation.name}</span>),
              (<span key="price" className={clsx('text-right')}>{translation.price}</span>),
              (<span key="-plan">{translation.plan}</span>),
            ]}
          />
        )}
      </Modal>
      <Section titleText={translation.invoices}>
        {(isError || !hasNecessaryExtensions) && (<span className={clsx('There was an Error')}></span>)}
        {!isError && isLoading && (<LoadingAnimation/>)}
        {!isError && !isLoading && (
          <div className={clsx('flex flex-wrap gap-x-8 gap-y-12')}>
            <Table
              className={clsx('w-full h-full')}
              data={data}
              identifierMapping={dataObject => dataObject.uuid}
              header={[
                (<span key="date">{translation.date}</span>),
                (<span key="name">{translation.name}</span>),
                (<span key="price">{translation.price}</span>),
                (<span key="details" className={clsx('min-w-[120px] text-left')}>{translation.details}</span>),
                (<span key="paymentStatus">{translation.paymentStatus}</span>),
                (<span key="paymentDate">{translation.paymentDate}</span>),
                (<span key="actions">{translation.actions}</span>),
              ]}
              rowMappingToCells={dataObject => [
                (<span key={dataObject.uuid + '-date'}>{dataObject.date.toDateString()}</span>),
                (<span key={dataObject.uuid + '-name'}>{dataObject.name}</span>),
                (
                  <span key={dataObject.uuid + '-price'} className={clsx('font-semibold')}>
                    {dataObject.products!.reduce((sum, product) => sum + product.price, 0).toFixed(2) + '€'}
                  </span>
                ),
                (
                  <div key={dataObject.uuid + '-details'} className={clsx('flex flex-col')}>
                    <span>{translation.products(dataObject.products!.length)}</span>
                    <SolidButton size="small" onClick={() => setDetailModalId(dataObject.uuid)} className={clsx('flex flex-row items-center gap-x-1 p-0')} variant="text">
                      {translation.show}
                      <ChevronRight size={16}/>
                    </SolidButton>
                  </div>
                ),
                (
                  <span
                    key={dataObject.uuid + '-payment-status'}
                    className={clsx({
                      'text-negative': dataObject.status === 'notPayed',
                      'text-warning': dataObject.status === 'pending' || dataObject.status === 'overdue',
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
                  <SolidButton key={dataObject.uuid + '-pay'} disabled={!!dataObject.paymentDate}>
                    {translation.payNow}
                  </SolidButton>
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
