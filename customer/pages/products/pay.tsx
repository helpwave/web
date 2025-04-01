import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { useProductsAllQuery } from '@/api/mutations/product_mutations'
import { Section } from '@/components/layout/Section'
import { tw } from '@twind/core'
import type { Product, ProductPlanTranslation } from '@/api/dataclasses/product'
import { defaultProductPlanTranslation } from '@/api/dataclasses/product'
import { Button } from '@helpwave/common/components/Button'
import { ChevronLeft, Coins } from 'lucide-react'
import { useState } from 'react'
import { Checkbox } from '@helpwave/common/components/user-input/Checkbox'
import Link from 'next/link'
import { useAuth, withAuth } from '@/hooks/useAuth'
import { withOrganization } from '@/hooks/useOrganization'
import { withCart } from '@/hocs/withCart'
import { useCart } from '@/hooks/useCart'
import { useContractsForProductsQuery } from '@/api/mutations/contract_mutations'
import { useRouter } from 'next/router'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { ProductAPI } from '@/api/services/product'

type ProductsTranslation = {
  checkout: string,
  name: string,
  price: string,
  termsAndConditions: string,
  cancel: string,
  pay: string,
  total: string,
} & ProductPlanTranslation

const defaultProductsTranslations: Record<Languages, ProductsTranslation> = {
  en: {
    ...defaultProductPlanTranslation.en,
    checkout: 'Checkout',
    name: 'Name',
    price: 'Price',
    termsAndConditions: 'Terms and Conditions',
    cancel: 'Cancel',
    pay: 'Book for a Fee',
    total: 'Total',
  },
  de: {
    ...defaultProductPlanTranslation.de,
    checkout: 'Kasse',
    name: 'Name',
    price: 'Preis',
    termsAndConditions: 'Nutzungsvereinbarung und -konditionen',
    cancel: 'Abbrechen',
    pay: 'Kostenpflichtig Buchen',
    total: 'Total',
  }
}

type ContractAcceptedType = Record<string, Record<string, boolean>>

const Payment: NextPage = () => {
  const translation = useTranslation(defaultProductsTranslations)
  const router = useRouter()
  const { authHeader } = useAuth()
  const { cart } = useCart()
  const {
    data: contracts,
    isLoading: contractsLoading,
    isError: contractsError
  } = useContractsForProductsQuery(cart.map(value => value.id))
  const [acceptedContracts, setAcceptedContracts] = useState<ContractAcceptedType>({})
  const { data: products, isLoading: productsLoading, isError: productsError } = useProductsAllQuery()
  // const [voucher, setVoucher] = useState<string>('') // TODO add later

  const isError = contractsError || productsError
  const isLoading = contractsLoading || productsLoading

  const allContractsAccepted = !!contracts && Object.keys(contracts).every(key => contracts[key]!.every(contract => acceptedContracts[key] ? (acceptedContracts[key][contract.uuid] ?? false) : false))

  const totalSum = cart.map(cartItem => {
    const plan = products?.find(product => product.uuid === cartItem.id)?.plan.find(plan => plan.type === plan.type)
    const voucher = cartItem.voucher
    // TODO let the backend provide this
    return Math.round(Math.max((plan?.costEuro ?? 0) * (1 - (voucher?.discountPercentage ?? 0)) - (voucher?.discountFixedAmount ?? 0), 0) * 100) / 100
  }).reduce((previousValue, currentValue) => (currentValue) + previousValue, 0)

  return (
    <Page pageTitle={titleWrapper(translation.checkout)}>
      <Section titleText={translation.checkout}>
        <LoadingAndErrorComponent isLoading={isLoading} hasError={isError}>
          {products && (
            <table>
              <thead>
              <tr className={tw('font-bold')}>
                <td>{translation.name}</td>
                <td>{translation.price}</td>
              </tr>
              </thead>
              <tbody>
              {cart.map(cartItem => {
                const product: Product = products.find(value => value.uuid === cartItem.id)!
                const plan = product.plan.find(value => value.uuid === cartItem.plan.uuid)!
                const voucher = cartItem.voucher
                // TODO let the backend provide this
                const price = Math.max((plan?.costEuro ?? 0) * (1 - (voucher?.discountPercentage ?? 0)) - (voucher?.discountFixedAmount ?? 0), 0).toFixed(2)
                return (
                  <tr key={cartItem.id}>
                    <td key={`${cartItem.id}+name`}>{`${product.name} (${translation[plan.type]})`}</td>
                    <td key={`${cartItem.id}+price`} className={tw('float-right')}>{`${price}€`}</td>
                  </tr>
                )
              })}
              <tr>
                <td className={tw('border-t-2')}><span className={tw('font-semibold')}>{translation.total}</span></td>
                <td className={tw('border-t-2')}><span
                  className={tw('font-semibold float-right')}>{`${totalSum.toFixed(2)}€`}</span></td>
              </tr>
              </tbody>
            </table>
          )}
          <h4 className={tw('font-bold text-xl')}>{translation.termsAndConditions}</h4>
          {products && contracts && (
            <form className={tw('flex flex-col gap-y-4')}>
              {cart.map((item) => {
                const product = products.find(value => value.uuid === item.id)
                if (!product) {
                  return null // TODO make this error visible to the user
                }
                const productContracts = contracts[product.uuid]
                if (!productContracts) {
                  return null // TODO make this error visible to the user
                }
                return (
                  <div key={product.uuid} className={tw('flex flex-col gap-y-2')}>
                    <h4 className={tw('font-space text-lg font-semibold')}>{product.name}</h4>
                    {productContracts.map(contract => {
                      const isAccepted = acceptedContracts[product.uuid] ? (acceptedContracts[product.uuid]![contract.uuid] ?? false) : false
                      return (
                        <div key={contract.uuid} className={tw('flex flex-row gap-x-2')}>
                          <Checkbox
                            checked={isAccepted}
                            onChange={() => {
                              setAcceptedContracts(prevState => ({
                                ...prevState,
                                [product.uuid]: {
                                  ...prevState[product.uuid],
                                  [contract.uuid]: !isAccepted,
                                },
                              }))
                            }}
                            containerClassName={tw('justify-start')}
                          />
                          {/* TODO url is optional consider changing it later*/}
                          <Link
                            href={contract.url!} target="_blank"
                            className={tw('font-bold text-lg font-semibold')}
                          >
                            {contract.key}
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
              <div className={tw('flex flex-row justify-between')}>
                <Button
                  className={tw('flex flex-row items-center gap-x-2 w-[200px]')}
                  onClick={() => router.push('/products/overview')}
                  type="button"
                >
                  <ChevronLeft/>
                  {translation.cancel}
                </Button>
                <Button
                  className={tw('flex flex-row items-center gap-x-2 w-[200px]')}
                  disabled={!allContractsAccepted}
                  type="submit"
                  onClick={async () => {
                    for (const value of cart) {
                      await ProductAPI.book({
                        uuid: value.id,
                        plan_id: value.plan.uuid,
                        accepted_contracts: Object.keys(acceptedContracts[value.id] ?? {}),
                        voucher: value.voucher?.uuid,
                      }, authHeader)
                    }
                    router.push('/invoices').catch(console.error)
                  }}
                >
                  <Coins/>
                  {translation.pay}
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
