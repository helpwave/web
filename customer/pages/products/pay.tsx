import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { useProductQuery, useProductsAllQuery } from '@/api/mutations/product_mutations'
import { Section } from '@/components/layout/Section'
import { tw } from '@twind/core'
import type { ProductPlanTranslation } from '@/api/dataclasses/product'
import { defaultProductPlanTranslation } from '@/api/dataclasses/product'
import { Button } from '@helpwave/common/components/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Checkbox } from '@helpwave/common/components/user-input/Checkbox'
import Link from 'next/link'
import { withAuth } from '@/hooks/useAuth'
import { withOrganization } from '@/hooks/useOrganization'
import { withCart } from '@/hocs/withCart'
import { useCart } from '@/hooks/useCart'
import { useContractsQuery } from '@/api/mutations/contract_mutations'
import { useRouter } from 'next/router'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'

type ProductsTranslation = {
  products: string,
  checkout: string,
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
  cancel: string,
  pay: string,
  plans: string,
} & ProductPlanTranslation

const defaultProductsTranslations: Record<Languages, ProductsTranslation> = {
  en: {
    ...defaultProductPlanTranslation.en,
    products: 'Products',
    checkout: 'Checkout',
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
    cancel: 'Cancel',
    pay: 'Pay',
    plans: 'Plans'
  },
  de: {
    ...defaultProductPlanTranslation.de,
    products: 'Produkte',
    checkout: 'Kasse',
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
    cancel: 'Abbrechen',
    pay: 'Bezahlen',
    plans: 'Pläne'
  }
}


const Payment: NextPage = () => {
  const translation = useTranslation(defaultProductsTranslations)
  const router = useRouter()
  const { cart } = useCart()
  const { data: contracts, isLoading: contractsLoading, isError: contractsError } = useContractsQuery()
  const { data: products, isLoading: productsLoading, isError: productsError } = useProductsAllQuery()
  const [voucher, setVoucher] = useState<string>('')

  const isError = contractsError || productsError
  const isLoading = contractsLoading || productsLoading


  return (
    <Page pageTitle={titleWrapper(translation.checkout)}>
      <Section titleText={translation.contract}>
        <LoadingAndErrorComponent isLoading={isLoading} hasError={isError}>
          {products && contracts && (
            <form className={tw('flex flex-col gap-y-4')}>
              {cart.map((item, index) => {
                const product = products.find(value => value.uuid === item.id)
                // TODO use the correct contracts here
                const productContracts = [contracts[index % contracts.length], contracts[(index + 1) % contracts.length]]
                if (!product || !contract) {
                  return null
                }
                return (
                  <div key={product.uuid} className={tw('flex flex-col gap-y-2')}>
                    <h4 className={tw('font-space text-lg font-semibold')}>{product.name}</h4>
                    {productContracts.map(contract => (
                      <div key={contract.uuid} className={tw('flex flex-row gap-x-2')}>
                        <Checkbox
                          checked={contract.lastAccepted !== undefined}
                          onChange={() => {
                            setCartProducts(prevState => prevState.map(value => {
                              if (value.productUUID !== item.productUUID) {
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
                        <Link href={contract.url} target="_blank"
                              className={tw('font-bold text-lg font-semibold')}>{contract.name}</Link>
                      </div>
                    ))}
                  </div>
                )
              })}
              <div className={tw('flex flex-row justify-between')}>
                <Button
                  className={tw('flex flex-row items-center gap-x-2 w-[200px]')}
                  onClick={() => router.push('/products/overview')}
                >
                  <ChevronLeft/>
                  {translation.cancel}
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
          )}
        </LoadingAndErrorComponent>
      </Section>
    </Page>
  )
}

export default withAuth(withOrganization(withCart(Payment)))
