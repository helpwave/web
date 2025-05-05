import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useProductsAvailableQuery } from '@/api/mutations/product_mutations'
import { Section } from '@/components/layout/Section'
import { LoadingAnimation } from '@helpwave/common/components/LoadingAnimation'
import type {
  Product,
  ProductPlanTranslation
} from '@/api/dataclasses/product'
import {
  defaultProductPlanTranslation
} from '@/api/dataclasses/product'
import { ChevronRight } from 'lucide-react'
import { withAuth } from '@/hooks/useAuth'
import { withOrganization } from '@/hooks/useOrganization'
import { withCart } from '@/hocs/withCart'
import { useCart } from '@/hooks/useCart'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { useRouter } from 'next/router'
import { Modal } from '@helpwave/common/components/modals/Modal'
import { useState } from 'react'
import { ContractList } from '@/components/ContractList'
import { defaultLocaleFormatters } from '@/utils/locale'
import {SolidButton, TextButton} from "@helpwave/common/components/Button";

type ProductsTranslation = {
  bookProduct: string,
  products: string,
  error: string,
  details: string,
  book: string,
  name: string,
  price: string,
  contract: string,
  contracts: string,
  actions: string,
  plan: string,
  back: string,
  pay: string,
  plans: string,
  change: string,
  noProducts: string,
  noContracts: string,
  lookAt: string,
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
    contracts: 'Contracts',
    actions: 'Actions',
    plan: 'Plan',
    back: 'Back',
    pay: 'Pay',
    plans: 'Plans',
    change: 'Change',
    noProducts: 'No Products found.',
    noContracts: 'No Contracts',
    lookAt: 'Look at'
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
    contracts: 'Verträge',
    actions: 'Aktionen',
    plan: 'Plan',
    back: 'Zurück',
    pay: 'Bezahlen',
    plans: 'Pläne',
    change: 'Wechseln',
    noProducts: 'Keine Produkte gefunden.',
    noContracts: 'Keine Verträge',
    lookAt: 'Anzeigen'
  }
}

const ProductShop: NextPage = () => {
  const translation = useTranslation(defaultProductsTranslations)
  const { addItem, clearCart } = useCart()
  const { data: products, isError, isLoading } = useProductsAvailableQuery()
  const router = useRouter()
  const [productModalProductValue, setProductModalProductValue] = useState<Product>()
  const localeTranslation = useTranslation(defaultLocaleFormatters)

  return (
    <Page pageTitle={titleWrapper(translation.bookProduct)} mainContainerClassName={'min-h-[80vh]'}>
      <Modal
        id="productModal"
        isOpen={!!productModalProductValue}
        titleText={productModalProductValue?.name}
        modalClassName={'col gap-y-4'}
        onBackgroundClick={() => setProductModalProductValue(undefined)}
        onCloseClick={() => setProductModalProductValue(undefined)}
      >
        <span>{productModalProductValue?.description}</span>
        <ContractList productIds={productModalProductValue ? [productModalProductValue.uuid] : []}></ContractList>
      </Modal>

      <Section titleText={translation.bookProduct}>
        {isError && (<span>{translation.error}</span>)}
        {!isError && isLoading && (<LoadingAnimation />)}
        {!isError && !isLoading && (
          <div className={'col gap-x-8 gap-y-12'}>
            {products.length == 0 ?
              (<span>{translation.noProducts}</span>) :
              products.map((product, index) => {
                return (
                  <div
                    key={index}
                    className={'col gap-y-2 bg-hw-primary-300 px-4 py-2 rounded-md'}
                  >
                    <div className={'row justify-between'}>
                      <h4 className={'font-bold font-space text-2xl'}>{product.name}</h4>
                      <TextButton
                        color={"neutral"}
                        className={'p-0'}
                        onClick={() => {
                          setProductModalProductValue(product)
                        }}
                      >
                        {translation.details}
                        <ChevronRight size={16} />
                      </TextButton>
                    </div>
                    <div className={'row gap-x-4'}>
                      {product.plan.map(plan => {
                        return (
                          <div key={plan.uuid} className={'col gap-y-6 bg-white rounded-lg px-4 py-2'}>
                            <span className={'font-space font-bold text-xl'}>{translation.productPlan(plan)}</span>
                            <span className={'row gap-x-1 justify-center font-semibold text-lg'}>
                              <span className={'text-3xl'}>{localeTranslation.formatMoney(plan.costEuro)}</span>
                            </span>
                            <SolidButton
                              className={'items-center justify-center gap-x-2 w-[160px]'}
                              onClick={async () => {
                                clearCart()
                                addItem({ id: product.uuid, quantity: 1, plan: { uuid: plan.uuid, type: plan.type } })
                                router.push('/products/overview').catch(console.error)
                              }}
                            >
                              {translation.book}
                            </SolidButton>
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
