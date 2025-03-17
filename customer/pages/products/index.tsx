import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { useProductsQuery } from '@/api/mutations/product_mutations'
import { Section } from '@/components/layout/Section'
import { tw } from '@twind/core'
import { LoadingAnimation } from '@helpwave/common/components/LoadingAnimation'
import type { ProductPlanTranslation } from '@/api/dataclasses/product'
import { defaultProductPlanTranslation } from '@/api/dataclasses/product'
import { useCustomerProductsSelfQuery } from '@/api/mutations/customer_product_mutations'
import { Button } from '@helpwave/common/components/Button'
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
import type { CustomerProduct } from '@/api/dataclasses/customer_product'
import { Table } from '@helpwave/common/components/Table'
import { useCustomerMyselfQuery } from '@/api/mutations/customer_mutations'
import { ContractsAPI } from '@/api/services/contract'
import { Checkbox } from '@helpwave/common/components/user-input/Checkbox'
import Link from 'next/link'
import { withAuth } from '@/hooks/useAuth'
import { withOrganization } from '@/hooks/useOrganization'

type ProductsTranslation = {
  products: string,
  toCheckOut: string,
  error: string,
  details: string,
  addToCart: string,
  removeFromCart: string,
  alreadyBought: string,
  overview: string,
  name: string,
  price: string,
  contract: string,
  actions: string,
  plan: string,
  back: string,
  pay: string,
  plans: string,
} & ProductPlanTranslation

const defaultProductsTranslations: Record<Languages, ProductsTranslation> = {
  en: {
    ...defaultProductPlanTranslation.en,
    products: 'Products',
    toCheckOut: 'Go to Checkout',
    error: 'There was an error',
    details: 'Details',
    addToCart: 'Add to Cart',
    removeFromCart: 'Remove',
    alreadyBought: 'Already Bought',
    overview: 'Overview',
    name: 'Name',
    price: 'Price',
    contract: 'Contract',
    actions: 'Actions',
    plan: 'Plan',
    back: 'Back',
    pay: 'Pay',
    plans: 'Plans'
  },
  de: {
    ...defaultProductPlanTranslation.de,
    products: 'Produkte',
    toCheckOut: 'Zur Kasse',
    error: 'Es gab einen Fehler',
    details: 'Details',
    addToCart: 'Hinzufügen',
    removeFromCart: 'Entfernen',
    alreadyBought: 'Bereits Gekauft',
    overview: 'Übersicht',
    name: 'Name',
    price: 'Preis',
    contract: 'Vertrag',
    actions: 'Aktionen',
    plan: 'Plan',
    back: 'Zurück',
    pay: 'Bezahlen',
    plans: 'Pläne'
  }
}


type ProductsStep = 'shopping' | 'overview' | 'contracts' | 'payment'

type ProductsShoppingProps = {
  cartProducts: CustomerProduct[],
  setCartProducts: Dispatch<SetStateAction<CustomerProduct[]>>,
  onCheckoutClick: () => void,
}

const ProductsShopping = ({
                            cartProducts,
                            setCartProducts,
                            onCheckoutClick
                          }: ProductsShoppingProps) => {
  const translation = useTranslation(defaultProductsTranslations)
  const { data: customer, isLoading: customerLoading, isError: customerError } = useCustomerMyselfQuery()
  const {
    data: bookedProducts,
    isError: bookedProductsError,
    isLoading: bookedProductsLoading
  } = useCustomerProductsSelfQuery()
  const { data: products, isError: productsError, isLoading: productsLoading } = useProductsQuery()

  const isError = bookedProductsError || productsError || customerError
  const isLoading = bookedProductsLoading || productsLoading || customerLoading

  return (
    <>
      <Section>
        <div className={tw('flex flex-row justify-between items-center')}>
          <h2 className={tw('font-bold font-space text-3xl')}>{translation.products}</h2>
          <Button className={tw('flex flex-row items-center gap-x-2 w-[200px]')} disabled={cartProducts.length === 0}
                  onClick={onCheckoutClick}>
            <ShoppingCart/>
            {`${translation.toCheckOut} (${cartProducts.length})`}
          </Button>
        </div>
        {isError && (<span>{translation.error}</span>)}
        {!isError && isLoading && (<LoadingAnimation/>)}
        {!isError && !isLoading && (
          <div className={tw('flex flex-wrap gap-x-8 gap-y-12')}>
            {products.map((product, index) => {
              const isBookedAlready = bookedProducts.findIndex(value => value.productUUID === product.uuid) !== -1
              const isInCart = cartProducts.findIndex(value => value.productUUID === product.uuid) !== -1
              return (
                <div
                  key={index}
                  className={tw('flex flex-col gap-y-2 min-w-[200px] max-w-[200px] bg-hw-primary-300 px-4 py-2 rounded-md')}
                >
                  <h4 className={tw('font-bold font-space text-xl')}>{product.name}</h4>
                  <span className={tw('font-semibold text-lg')}>{translation.plans}</span>
                  {product.plan.map(plan => (
                    <div key={plan.uuid} className={tw('flex flex-row justify-between')}>
                      <span className={tw('font-semibold text-lg')}>{`${plan.costEuro}€`}</span>
                      {translation[plan.type]}
                    </div>
                  ))}
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
                  <div className={tw('flex flex-row justify-end items-end h-full')}>
                    {isBookedAlready && (
                      <span className={tw('py-2')}>{translation.alreadyBought}</span>
                    )}
                    {!isBookedAlready && (
                      <Button
                        className={tw('flex flex-row items-center gap-x-2 w-[160px]')}
                        onClick={async () => {
                          if (isInCart) {
                            setCartProducts(prevState => prevState.filter(value => value.productUUID !== product.uuid))
                          } else {
                            const contracts = await ContractsAPI.getForProduct(product.uuid)
                            setCartProducts(prevState => ([...prevState, {
                              productUUID: product.uuid,
                              product,
                              status: 'inCart',
                              startDate: new Date(),
                              customerUUID: customer!.uuid,
                              contracts
                            }]))
                          }
                        }}
                      >
                        {isInCart ? <Minus size={20}/> : <Plus size={20}/>}
                        {isInCart ? translation.removeFromCart : translation.addToCart}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Section>
      <Section className={tw('flex flex-row justify-end')}>
        <Button className={tw('flex flex-row items-center gap-x-2 w-[200px]')} disabled={cartProducts.length === 0}
                onClick={onCheckoutClick}>
          <ShoppingCart/>
          {`${translation.toCheckOut} (${cartProducts.length})`}
          <ChevronRight/>
        </Button>
      </Section>
    </>
  )
}

type ProductsOverviewProps = {
  cartProducts: CustomerProduct[],
  setCartProducts: Dispatch<SetStateAction<CustomerProduct[]>>,
  onBackClick: () => void,
  onCheckoutClick: () => void,
}
const ProductsOverview = ({
                            cartProducts,
                            setCartProducts,
                            onCheckoutClick,
                            onBackClick
                          }: ProductsOverviewProps) => {
  const translation = useTranslation(defaultProductsTranslations)

  return (
    <>
      <Section titleText={translation.overview}>
        <Table
          data={cartProducts}
          identifierMapping={dataObject => dataObject.productUUID}
          rowMappingToCells={dataObject => [
            <span key={dataObject.productUUID + 'name'}>{dataObject.product!.name}</span>,
            <span key={dataObject.productUUID + 'price'}>{dataObject.product!.price + '€'}</span>,
            <span key={dataObject.productUUID + 'plan'}>{translation[dataObject.product!.plan]}</span>,
            <Button
              variant="text"
              key={dataObject.productUUID + 'action'}
              onClick={() => setCartProducts(prevState => prevState.filter(value => value.productUUID !== dataObject.productUUID))}
            >
              {translation.removeFromCart}
            </Button>,
          ]}
          header={[
            <span key="name">{translation.name}</span>,
            <span key="price">{translation.price}</span>,
            <span key="plan">{translation.plan}</span>,
            <span key="actions">{translation.actions}</span>,
          ]}
        />
      </Section>
      <Section className={tw('flex flex-row justify-between')}>
        <Button
          className={tw('flex flex-row items-center gap-x-2 w-[200px]')}
          onClick={onBackClick}
        >
          <ChevronLeft/>
          {translation.back}
        </Button>
        <Button
          className={tw('flex flex-row items-center gap-x-2 w-[200px]')}
          disabled={cartProducts.length === 0}
          onClick={onCheckoutClick}
        >
          <ShoppingCart/>
          {`${translation.toCheckOut} (${cartProducts.length})`}
          <ChevronRight/>
        </Button>
      </Section>
    </>
  )
}

type ProductsContractProps = {
  cartProducts: CustomerProduct[],
  setCartProducts: Dispatch<SetStateAction<CustomerProduct[]>>,
  onBackClick: () => void,
  onCheckoutClick: () => void,
}
const ProductsContract = ({
                            cartProducts,
                            setCartProducts,
                            onCheckoutClick,
                            onBackClick
                          }: ProductsContractProps) => {
  const translation = useTranslation(defaultProductsTranslations)

  const allContractsAccepted = cartProducts.every(value => value.contracts.every(contract => contract.lastAccepted !== undefined))

  return (
    <Section titleText={translation.contract}>
      <form className={tw('flex flex-col gap-y-4')}>
        {cartProducts.map(booking => (
          <div key={booking.productUUID} className={tw('flex flex-col gap-y-2')}>
            <h4 className={tw('font-space text-lg font-semibold')}>{booking.product!.name}</h4>
            {booking.contracts.map(contract => (
              <div key={contract.uuid} className={tw('flex flex-row gap-x-2')}>
                <Checkbox
                  checked={contract.lastAccepted !== undefined}
                  onChange={() => {
                    setCartProducts(prevState => prevState.map(value => {
                      if (value.productUUID !== booking.productUUID) {
                        return value
                      }
                      return {
                        ...value,
                        contracts: value.contracts.map(valueContract => {
                          if (valueContract.uuid === contract.uuid) {
                            return {
                              ...valueContract,
                              lastAccepted: contract.lastAccepted !== undefined ? undefined : new Date()
                            }
                          }
                          return valueContract
                        })
                      }
                    }))
                  }}
                  containerClassName={tw('justify-start')}
                />
                <Link href={contract.url} target="_blank" className={tw('font-bold text-lg font-semibold')}>{contract.name}</Link>
              </div>
            ))}
          </div>
        ))}
        <div className={tw('flex flex-row justify-between')}>
          <Button
            className={tw('flex flex-row items-center gap-x-2 w-[200px]')}
            onClick={onBackClick}
          >
            <ChevronLeft/>
            {translation.back}
          </Button>
          <Button
            className={tw('flex flex-row items-center gap-x-2 w-[200px]')}
            disabled={!allContractsAccepted}
            onClick={onCheckoutClick}
          >
            {translation.pay}
            <ChevronRight/>
          </Button>
        </div>
      </form>
    </Section>
  )
}

const Products: NextPage<PropsForTranslation<ProductsTranslation>> = ({ overwriteTranslation }) => {
  const translation = useTranslation(defaultProductsTranslations, overwriteTranslation)
  const [step, setStep] = useState<ProductsStep>('shopping')
  const [cartProducts, setCartProducts] = useState<CustomerProduct[]>([])

  return (
    <Page pageTitle={titleWrapper(translation.products)} mainContainerClassName={tw('h-[80vh] justify-between')}>
      {step === 'shopping' && (
        <ProductsShopping
          cartProducts={cartProducts}
          setCartProducts={setCartProducts}
          onCheckoutClick={() => setStep('overview')}
        />
      )}
      {step === 'overview' && (
        <ProductsOverview
          cartProducts={cartProducts}
          setCartProducts={setCartProducts}
          onCheckoutClick={() => setStep('contracts')}
          onBackClick={() => setStep('shopping')}
        />
      )}
      {step === 'contracts' && (
        <ProductsContract
          cartProducts={cartProducts}
          setCartProducts={setCartProducts}
          onCheckoutClick={() => setStep('payment')}
          onBackClick={() => setStep('overview')}
        />
      )}
      {step === 'payment' && (
        <Section titleText={translation.pay}>
          <Button
            className={tw('flex flex-row items-center gap-x-2 w-[200px]')}
            onClick={() => setStep('contracts')}
          >
            <ChevronLeft/>
            {translation.back}
          </Button>
        </Section>
      )}
    </Page>
  )
}

export default withAuth(withOrganization(Products))
