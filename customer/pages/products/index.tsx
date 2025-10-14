import type { NextPage } from 'next'
import type { Translation } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import { useProductsAllQuery } from '@/api/mutations/product_mutations'
import { Section } from '@/components/layout/Section'
import clsx from 'clsx'
import { LoadingAnimation } from '@helpwave/hightide'
import type { ProductPlanTranslation } from '@/api/dataclasses/product'
import { defaultProductPlanTranslation } from '@/api/dataclasses/product'
import {
  useCustomerProductDeleteMutation,
  useCustomerProductsSelfQuery
} from '@/api/mutations/customer_product_mutations'
import { withAuth } from '@/hooks/useAuth'
import { withOrganization } from '@/hooks/useOrganization'
import { withCart } from '@/hocs/withCart'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { SolidButton } from '@helpwave/hightide'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Modal } from '@helpwave/hightide'
import { ConfirmDialog } from '@helpwave/hightide'
import type {
  CustomerProductStatus,
  ResolvedCustomerProduct
} from '@/api/dataclasses/customer_product'
import {
  CustomerProductStatusCancelable,
  CustomerProductStatusPlannedCancellation
} from '@/api/dataclasses/customer_product'
import {
  defaultCustomerProductStatusTranslation
} from '@/api/dataclasses/customer_product'
import { ContractList } from '@/components/ContractList'
import { defaultLocaleFormatters } from '@/utils/locale'

type ProductsTranslation = {
  bookProduct: string,
  myProducts: string,
  noProductsYet: string,
  error: string,
  details: string,
  contract: string,
  contracts: string,
  manage: string,
  cancel: string,
  noContracts: string,
  lookAt: string,
  cancelSubscription: string,
  cancelSubscriptionDescription: string,
  endsAt: string,
} & ProductPlanTranslation



const defaultProductsTranslations: Translation<ProductsTranslation> = {
  en: {
    ...defaultProductPlanTranslation.en,
    bookProduct: 'Book new Product',
    myProducts: 'My Products',
    noProductsYet: 'No Products booked yet',
    error: 'There was an error',
    details: 'Details',
    contract: 'Contract',
    contracts: 'Contracts',
    manage: 'Manage',
    cancel: 'Cancel',
    noContracts: 'No Contracts',
    lookAt: 'Look at',
    cancelSubscription: 'Cancel',
    cancelSubscriptionDescription: 'This will permantly cancel your subscription and you will be required to book the product again.',
    endsAt: 'Ends at',
  },
  de: {
    ...defaultProductPlanTranslation.de,
    bookProduct: 'Neues Product buchen',
    myProducts: 'Meine Produkte',
    noProductsYet: 'Noch keine Produkte gebucht',
    error: 'Es gab einen Fehler',
    details: 'Details',
    contract: 'Vertrag',
    contracts: 'Verträge',
    manage: 'Verwalten',
    cancel: 'Kündigen',
    noContracts: 'Keine Verträge',
    lookAt: 'Anzeigen',
    cancelSubscription: 'Abonement aufheben',
    cancelSubscriptionDescription: 'Das Produkt wird permanent deaboniert und sie müssen zur erneuten Nutzung dieses erneut buchen.',
    endsAt: 'Endet am',
  }
}

type CustomerProductStatusDisplayProps = {
  customerProductStatus: CustomerProductStatus,
}

const CustomerProductStatusDisplay = ({ customerProductStatus }: CustomerProductStatusDisplayProps) => {
  const translation = useTranslation(defaultCustomerProductStatusTranslation)
  return (
    <div className={clsx('row items-center px-3 py-1 rounded-full text-sm font-bold', {
      'bg-positive text-on-positive': customerProductStatus === 'active',
      'bg-warning text-on-warning': customerProductStatus === 'activation' || customerProductStatus === 'scheduled',
      'bg-negative text-on-negative': customerProductStatus === 'expired' || customerProductStatus === 'payment' || customerProductStatus === 'canceled' || 'refunded',
      'bg-blue-500 text-white': customerProductStatus === 'trialing', // TODO replace color
    })}>
      {translation[customerProductStatus]}
    </div>
  )
}

const ProductsPage: NextPage = () => {
  const translation = useTranslation(defaultProductsTranslations)
  const router = useRouter()
  const {
    data: bookedProducts,
    isError: bookedProductsError,
    isLoading: bookedProductsLoading
  } = useCustomerProductsSelfQuery()
  const { data: products, isError: productsError, isLoading: productsLoading } = useProductsAllQuery()
  const [customerProductModalValue, setCustomerProductModalValue] = useState<ResolvedCustomerProduct>()
  const [cancelDialogId, setCancelDialogId] = useState<string>()
  const cancelMutation = useCustomerProductDeleteMutation()
  const localeTranslation = useTranslation(defaultLocaleFormatters)

  const isError = bookedProductsError || productsError
  const isLoading = bookedProductsLoading || productsLoading

  return (
    <Page pageTitle={titleWrapper(translation.myProducts)} mainContainerClassName="min-h-[80vh]">
      <Modal
        id="productModal"
        isOpen={!!customerProductModalValue}
        titleText={customerProductModalValue?.product.name}
        modalClassName="col gap-y-4"
        onBackgroundClick={() => setCustomerProductModalValue(undefined)}
        onCloseClick={() => setCustomerProductModalValue(undefined)}
      >
        <span>{customerProductModalValue?.product.description}</span>
        <ContractList
          productIds={customerProductModalValue ? [customerProductModalValue.product.uuid] : []}></ContractList>
        <SolidButton color="negative" disabled={!CustomerProductStatusCancelable.includes(customerProductModalValue?.status || 'active')}
          onClick={() => setCancelDialogId(customerProductModalValue?.uuid)}>
          {translation.cancel}
        </SolidButton>
      </Modal>

      <ConfirmDialog
        id="cancelBooking"
        isOpen={!!cancelDialogId}
        onConfirm={() => {
          cancelMutation.mutate(cancelDialogId!)
          setCancelDialogId(undefined)
        }}
        onBackgroundClick={() => setCancelDialogId(undefined)}
        onCloseClick={() => setCancelDialogId(undefined)}
        titleText={translation.cancelSubscription}
        descriptionText={translation.cancelSubscriptionDescription}
        confirmType="negative"
      />

      <Section titleText={translation.myProducts}>
        {isError && (<span>{translation.error}</span>)}
        {!isError && isLoading && (<LoadingAnimation />)}
        {!isError && !isLoading && products && bookedProducts && (
          <div className="grid grid-cols-1 desktop:grid-cols-2 gap-x-8 gap-y-12">
            {bookedProducts.map((bookedProduct, index) => {
              return (
                <div
                  key={index}
                  className="col border-4 justify-between gap-y-2 bg-surface text-on-surface px-8 py-4 rounded-md"
                >
                  <div className="col">
                    <div className="row justify-between">
                      <h4 className="font-bold font-space text-2xl">{bookedProduct.product.name}</h4>
                      <CustomerProductStatusDisplay customerProductStatus={bookedProduct.status} />
                    </div>
                    <span>{bookedProduct.product.description}</span>
                    <span>{`${translation.productPlan(bookedProduct.productPlan)} (${localeTranslation.formatMoney(bookedProduct.productPlan.costEuro)})`}</span>
                    {bookedProduct.cancellationDate && CustomerProductStatusPlannedCancellation.includes(bookedProduct.status) ? <span>{translation.endsAt} {localeTranslation.formatDate(bookedProduct.cancellationDate)}</span> : <></>}
                  </div>
                  <div className="row justify-end gap-x-4">
                    <SolidButton className="w-fit"
                      onClick={() => setCustomerProductModalValue(bookedProduct)}>{translation.manage}</SolidButton>
                  </div>
                </div>
              )
            })}
            <button
              key="buy"
              onClick={() => router.push('/products/shop').catch(console.error)}
              className="row justify-center items-center h-full min-h-[200px] w-full gap-x-2 border-4 border-dashed border-gray-200 hover:brightness-90 px-4 py-2 rounded-md"
            >
              <Plus size={32} />
              <h4 className="font-bold text-lg">{translation.bookProduct}</h4>
            </button>
          </div>
        )}
      </Section>
    </Page>
  )
}

export default withAuth(withOrganization(withCart(ProductsPage)))
