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
import { Button } from '@helpwave/common/components/Button'
import { ArrowRightLeft, ChevronRight, Minus, Plus, ShoppingCart } from 'lucide-react'
import { withAuth } from '@/hooks/useAuth'
import { withOrganization } from '@/hooks/useOrganization'
import { withCart } from '@/hocs/withCart'
import { useCart } from '@/hooks/useCart'
import Link from 'next/link'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'

type ProductsTranslation = {
  cart: string,
  products: string,
  error: string,
  details: string,
  addToCart: string,
  removeFromCart: string,
  alreadyBought: string,
  name: string,
  price: string,
  contract: string,
  actions: string,
  plan: string,
  back: string,
  pay: string,
  plans: string,
  change: string,
} & ProductPlanTranslation

const defaultProductsTranslations: Record<Languages, ProductsTranslation> = {
  en: {
    ...defaultProductPlanTranslation.en,
    cart: 'Cart',
    products: 'Products',
    error: 'There was an error',
    details: 'Details',
    addToCart: 'Add to Cart',
    removeFromCart: 'Remove',
    alreadyBought: 'Already Bought',
    name: 'Name',
    price: 'Price',
    contract: 'Contract',
    actions: 'Actions',
    plan: 'Plan',
    back: 'Back',
    pay: 'Pay',
    plans: 'Plans',
    change: 'Change'
  },
  de: {
    ...defaultProductPlanTranslation.de,
    cart: 'Warenkorb',
    products: 'Produkte',
    error: 'Es gab einen Fehler',
    details: 'Details',
    addToCart: 'Hinzufügen',
    removeFromCart: 'Entfernen',
    alreadyBought: 'Bereits Gekauft',
    name: 'Name',
    price: 'Preis',
    contract: 'Vertrag',
    actions: 'Aktionen',
    plan: 'Plan',
    back: 'Zurück',
    pay: 'Bezahlen',
    plans: 'Pläne',
    change: 'Wechseln'
  }
}

const ProductShop: NextPage = () => {
  const translation = useTranslation(defaultProductsTranslations)
  const { cart, addItem, removeItem, updateItem } = useCart()
  const {
    data: bookedProducts,
    isError: bookedProductsError,
    isLoading: bookedProductsLoading
  } = useCustomerProductsSelfQuery()
  const { data: products, isError: productsError, isLoading: productsLoading } = useProductsAllQuery()

  const isError = bookedProductsError || productsError
  const isLoading = bookedProductsLoading || productsLoading

  return (
    <Page pageTitle={titleWrapper(translation.products)} mainContainerClassName={tw('min-h-[80vh]')}>
      <Section>
        <div className={tw('flex flex-row justify-between items-center')}>
          <h2 className={tw('font-bold font-space text-3xl')}>{translation.products}</h2>
          <Link
            className={tw('flex flex-row items-center justify-between gap-x-4 w-[200px] bg-hw-primary-400 rounded-md px-4 py-2')}
            href="/products/overview"
          >
            <span className={tw('flex flex-row gap-x-2 items-center')}>
               <ShoppingCart size={20}/>
              {`${translation.cart}`}
            </span>
            <span>{`(${cart.length})`}</span>
          </Link>
        </div>
        {isError && (<span>{translation.error}</span>)}
        {!isError && isLoading && (<LoadingAnimation/>)}
        {!isError && !isLoading && (
          <div className={tw('flex flex-col gap-x-8 gap-y-12')}>
            {products.map((product, index) => {
              const isBookedAlready = bookedProducts.findIndex(value => value.productUUID === product.uuid) !== -1
              const cartItem = cart.find(value => value.id === product.uuid)
              const isInCart = !!cartItem
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
                  <div className={tw('flex flex-row justify-between gap-x-4')}>
                    {product.plan.map(plan => {
                      const isPlanInCart = cartItem?.plan.uuid === plan.uuid
                      return (
                        <div key={plan.uuid} className={tw('flex flex-col gap-y-2 bg-white rounded-lg  px-4 py-2')}>
                          <span className={tw('font-space font-bold text-xl')}>{translation[plan.type]}</span>
                          <span className={tw('font-semibold text-lg')}>{`${plan.costEuro}€`}</span>
                          {isBookedAlready && (
                            <span className={tw('py-2')}>{translation.alreadyBought}</span>
                          )}
                          {!isBookedAlready && (
                            <Button
                              className={tw('flex flex-row items-center gap-x-2 w-[160px]')}
                              onClick={async () => {
                                if (isInCart) {
                                  if (isPlanInCart) {
                                    removeItem(product.uuid)
                                  } else {
                                    updateItem({ ...cartItem, plan: { uuid: plan.uuid, type: plan.type }, voucher: undefined })
                                  }
                                } else {
                                  // Differentiate between plans here
                                  addItem({ id: product.uuid, quantity: 1, plan:  { uuid: plan.uuid, type: plan.type } })
                                }
                              }}
                            >
                              {isInCart ? (!isPlanInCart ? <ArrowRightLeft size={20}/>: <Minus size={20}/>) : <Plus size={20}/>}
                              {isInCart ? (!isPlanInCart ? translation.change : translation.removeFromCart) : translation.addToCart}
                            </Button>
                          )}
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
