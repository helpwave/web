import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useProductsAllQuery } from '@/api/mutations/product_mutations'
import { Section } from '@/components/layout/Section'
import { tw, tx } from '@twind/core'
import { LoadingAnimation } from '@helpwave/common/components/LoadingAnimation'
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
import { Button } from '@helpwave/common/components/Button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Modal } from '@helpwave/common/components/modals/Modal'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import type {
  CustomerProductStatus,
  ResolvedCustomerProduct
} from '@/api/dataclasses/customer_product'
import {
  defaultCustomerProductStatusTranslation
} from '@/api/dataclasses/customer_product'
import { ContractList } from '@/components/ContractList'

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
} & ProductPlanTranslation

const defaultProductsTranslations: Record<Languages, ProductsTranslation> = {
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
    cancel: 'Cancel',
    noContracts: 'Keine Verträge',
    lookAt: 'Anzeigen',
    cancelSubscription: 'Abonement aufheben',
    cancelSubscriptionDescription: 'Das Produkt wird permanent deaboniert und sie müssen zur erneuten Nutzung dieses erneut buchen.',
  }
}

type CustomerProductStatusDisplayProps = {
  customerProductStatus: CustomerProductStatus,
}

const CustomerProductStatusDisplay = ({ customerProductStatus }: CustomerProductStatusDisplayProps) => {
  const translation = useTranslation(defaultCustomerProductStatusTranslation)
  return (
    <div className={tx('flex flex-row items-center px-3 py-1 rounded-full text-sm font-bold', {
      'bg-hw-positive-500 text-white': customerProductStatus === 'active',
      'bg-hw-warning-500 text-white': customerProductStatus === 'activation' || customerProductStatus === 'scheduled',
      'bg-hw-negative-500 text-white': customerProductStatus === 'expired' || customerProductStatus === 'payment' || customerProductStatus === 'canceled' || 'refunded',
      'bg-blue-500 text-white': customerProductStatus === 'trialing',
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

  const isError = bookedProductsError || productsError
  const isLoading = bookedProductsLoading || productsLoading

  return (
    <Page pageTitle={titleWrapper(translation.myProducts)} mainContainerClassName={tw('min-h-[80vh]')}>
      <Modal
        id="productModal"
        isOpen={!!customerProductModalValue}
        titleText={customerProductModalValue?.product.name}
        modalClassName={tw('flex flex-col gap-y-4')}
        onBackgroundClick={() => setCustomerProductModalValue(undefined)}
        onCloseClick={() => setCustomerProductModalValue(undefined)}
      >
        <span>{customerProductModalValue?.product.description}</span>
        <ContractList
          productIds={customerProductModalValue ? [customerProductModalValue.product.uuid] : []}></ContractList>
        <Button color="hw-negative" className={tw('!w-fit')}
                onClick={() => setCancelDialogId(customerProductModalValue?.uuid)}>
          {translation.cancel}
        </Button>
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
        {!isError && isLoading && (<LoadingAnimation/>)}
        {!isError && !isLoading && products && bookedProducts && (
          <div className={tw('grid grid-cols-1 desktop:grid-cols-2 gap-x-8 gap-y-12')}>
            {bookedProducts.map((bookedProduct, index) => {
              return (
                <div
                  key={index}
                  className={tw('flex flex-col justify-between gap-y-2 bg-gray-100 px-4 py-2 rounded-md')}
                >
                  <div className={tw('flex flex-col gap-y-2')}>
                    <div className={tw('flex flex-row gap-x-2 justify-between')}>
                      <h4 className={tw('font-bold font-space text-2xl')}>{bookedProduct.product.name}</h4>
                      <CustomerProductStatusDisplay customerProductStatus={bookedProduct.status}/>
                    </div>
                    <span>{bookedProduct.product.description}</span>
                    <span>{`${translation.productPlan(bookedProduct.productPlan)} (${bookedProduct.productPlan.costEuro}€)`}</span>
                  </div>
                  <div className={tw('flex flex-row justify-end gap-x-4')}>
                    <Button className={tw('!w-fit')}
                            onClick={() => setCustomerProductModalValue(bookedProduct)}>{translation.manage}</Button>
                  </div>
                </div>
              )
            })}
            <button
              key="buy"
              onClick={() => router.push('/products/shop').catch(console.error)}
              className={tw('flex flex-row justify-center items-center h-full min-h-[200px] w-full gap-x-2 border-4 border-dashed border-gray-200 hover:brightness-90 px-4 py-2 rounded-md')}
            >
              <Plus size={32}/>
              <h4 className={tw('font-bold text-lg')}>{translation.bookProduct}</h4>
            </button>
          </div>
        )}
      </Section>
    </Page>
  )
}

export default withAuth(withOrganization(withCart(ProductsPage)))
