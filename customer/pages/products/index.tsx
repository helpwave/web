import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useProductsAllQuery } from '@/api/mutations/product_mutations'
import { Section } from '@/components/layout/Section'
import { tw } from '@twind/core'
import { LoadingAnimation } from '@helpwave/common/components/LoadingAnimation'
import type { ProductPlanTranslation } from '@/api/dataclasses/product'
import { defaultProductPlanTranslation } from '@/api/dataclasses/product'
import { useCustomerProductsSelfQuery } from '@/api/mutations/customer_product_mutations'
import { withAuth } from '@/hooks/useAuth'
import { withOrganization } from '@/hooks/useOrganization'
import { withCart } from '@/hocs/withCart'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { Button } from '@helpwave/common/components/Button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/router'

type ProductsTranslation = {
  bookProduct: string,
  myProducts: string,
  noProductsYet: string,
  error: string,
  details: string,
  contract: string,
  change: string,
  cancel: string,
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
    change: 'Change',
    cancel: 'Cancel',
  },
  de: {
    ...defaultProductPlanTranslation.de,
    bookProduct: 'Neues Product buchen',
    myProducts: 'Meine Produkte',
    noProductsYet: 'Noch keine Produkte gebucht',
    error: 'Es gab einen Fehler',
    details: 'Details',
    contract: 'Vertrag',
    change: 'Wechseln',
    cancel: 'Cancel',
  }
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

  const isError = bookedProductsError || productsError
  const isLoading = bookedProductsLoading || productsLoading

  return (
    <Page pageTitle={titleWrapper(translation.myProducts)} mainContainerClassName={tw('min-h-[80vh]')}>
      <Section titleText={translation.myProducts}>
        {isError && (<span>{translation.error}</span>)}
        {!isError && isLoading && (<LoadingAnimation/>)}
        {!isError && !isLoading && products && bookedProducts && (
          <div className={tw('grid grid-cols-1 desktop:grid-cols-2 gap-x-8 gap-y-12')}>
            {bookedProducts.map((bookedProduct, index) => {
              return (
                <div
                  key={index}
                  className={tw('flex flex-col gap-y-2 bg-gray-200 px-4 py-2 rounded-md')}
                >
                  <h4 className={tw('font-bold font-space text-2xl')}>{bookedProduct.product.name}</h4>
                  <span>{ `${translation.productPlan(bookedProduct.productPlan)} (${bookedProduct.productPlan.costEuro}€)`}</span>
                  <div className={tw('flex flex-row gap-x-4')}>
                    <Button color="hw-negative" className={tw('!w-fit')}>{translation.cancel}</Button>
                    <Button className={tw('!w-fit')}>{translation.change}</Button>
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
