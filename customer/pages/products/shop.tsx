import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useProductsAvailableQuery } from '@/api/mutations/product_mutations'
import { Section } from '@/components/layout/Section'
import { tw } from '@twind/core'
import { LoadingAnimation } from '@helpwave/common/components/LoadingAnimation'
import type {
  ProductPlanTranslation
} from '@/api/dataclasses/product'
import {
  defaultProductPlanTranslation
} from '@/api/dataclasses/product'
import { Button } from '@helpwave/common/components/Button'
import { ChevronRight } from 'lucide-react'
import { withAuth } from '@/hooks/useAuth'
import { withOrganization } from '@/hooks/useOrganization'
import { withCart } from '@/hocs/withCart'
import { useCart } from '@/hooks/useCart'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { useRouter } from 'next/router'

type ProductsTranslation = {
  bookProduct: string,
  products: string,
  error: string,
  details: string,
  book: string,
  name: string,
  price: string,
  contract: string,
  actions: string,
  plan: string,
  back: string,
  pay: string,
  plans: string,
  change: string,
  noProducts: string,
} & ProductPlanTranslation

const defaultProductsTranslations: Record<Languages, ProductsTranslation> = {
  en: {
    ...defaultProductPlanTranslation.en,
    bookProduct: 'Book Product',
    products: 'Products',
    error: 'There was an error',
    details: 'Details',
    book: 'Book',
    name: 'Name',
    price: 'Price',
    contract: 'Contract',
    actions: 'Actions',
    plan: 'Plan',
    back: 'Back',
    pay: 'Pay',
    plans: 'Plans',
    change: 'Change',
    noProducts: 'No Products found.'
  },
  de: {
    ...defaultProductPlanTranslation.de,
    bookProduct: 'Produkt buchen',
    products: 'Produkte',
    error: 'Es gab einen Fehler',
    details: 'Details',
    book: 'Buchen',
    name: 'Name',
    price: 'Preis',
    contract: 'Vertrag',
    actions: 'Aktionen',
    plan: 'Plan',
    back: 'Zurück',
    pay: 'Bezahlen',
    plans: 'Pläne',
    change: 'Wechseln',
    noProducts: 'Keine Produkte gefunden.'
  }
}

const ProductShop: NextPage = () => {
  const translation = useTranslation(defaultProductsTranslations)
  const { addItem, clearCart } = useCart()
  const { data: products, isError, isLoading } = useProductsAvailableQuery()
  const router = useRouter()

  return (
    <Page pageTitle={titleWrapper(translation.bookProduct)} mainContainerClassName={tw('min-h-[80vh]')}>
      <Section titleText={translation.bookProduct}>
        {isError && (<span>{translation.error}</span>)}
        {!isError && isLoading && (<LoadingAnimation/>)}
        {!isError && !isLoading && (
          <div className={tw('flex flex-col gap-x-8 gap-y-12')}>
            {products.length == 0 ?
              (<span>{translation.noProducts}</span>) :
              products.map((product, index) => {
                return (
                  <div
                    key={index}
                    className={tw('flex flex-col gap-y-2 bg-hw-primary-300 px-4 py-2 rounded-md')}
                  >
                    <div className={tw('flex flex-row justify-between')}>
                      <h4 className={tw('font-bold font-space text-2xl')}>{product.name}</h4>
                      <Button
                        variant="text"
                        className={tw('p-0 flex flex-row items-center gap-x-1 text-hw-primary-700 hover:text-hw-primary-800')}
                        onClick={() => {
                          // TODO show modal here
                        }}
                      >
                        {translation.details}
                        <ChevronRight size={16}/>
                      </Button>
                    </div>
                    <div className={tw('flex flex-row gap-x-4')}>
                      {product.plan.map(plan => {
                        return (
                          <div key={plan.uuid} className={tw('flex flex-col gap-y-6 bg-white rounded-lg px-4 py-2')}>
                            <span className={tw('font-space font-bold text-xl')}>{translation.productPlan(plan)}</span>
                            <span className={tw('flex flex-row gap-x-1 justify-center font-semibold text-lg')}>
                              {`€`}
                              <span className={tw('text-3xl')}>{plan.costEuro}</span>
                            </span>
                            <Button
                              className={tw('flex flex-row items-center justify-center gap-x-2 w-[160px]')}
                              onClick={async () => {
                                clearCart()
                                addItem({ id: product.uuid, quantity: 1, plan: { uuid: plan.uuid, type: plan.type } })
                                router.push('/products/overview').catch(console.error)
                              }}
                            >
                              {translation.book}
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </Section>
    </Page>
  )
}

export default withAuth(withOrganization(withCart(ProductShop)))
