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
import { ChevronLeft, Coins, ExternalLink } from 'lucide-react'
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
import { CustomerProductsAPI } from '@/api/services/customer_product'

type ProductsTranslation = {
  checkout: string,
  name: string,
  price: string,
  termsAndConditions: string,
  cancel: string,
  pay: string,
  total: string,
  lookAt: string,
  acceptTerms: (name: string) => string,
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
    lookAt: 'Look at',
    acceptTerms: (name: string) => `Hereby I accept the terms of use for ${name}.`,
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
    lookAt: 'Anschauen',
    acceptTerms: (name: string) => `Hiermit akzeptiere ich die Nutzungsbedingungen von ${name}`,
  }
}

type ContractAcceptedType = Record<string, boolean>

const Payment: NextPage = () => {
  const translation = useTranslation(defaultProductsTranslations)
  const router = useRouter()
  const { authHeader } = useAuth()
  const { cart, clearCart } = useCart()
  const {
    data: contracts,
    isLoading: contractsLoading,
    isError: contractsError
  } = useContractsForProductsQuery(cart.map(value => value.id))
  const [acceptedContracts, setAcceptedContracts] = useState<ContractAcceptedType>({})
  const { data: products, isLoading: productsLoading, isError: productsError } = useProductsAllQuery()

  const isError = contractsError || productsError
  const isLoading = contractsLoading || productsLoading

  const allContractsAccepted = !!contracts && contracts.every(contract => acceptedContracts[contract.uuid])

  const totalSum = cart.map(cartItem => {
    const plan = products?.find(product => product.uuid === cartItem.id)?.plan.find(plan => plan.type === plan.type)
    const voucher = cartItem.voucher
    // TODO let the backend provide this
    return Math.round(Math.max((plan?.costEuro ?? 0) * (1 - (voucher?.discountPercentage ?? 0)) - (voucher?.discountFixedAmount ?? 0), 0) * 100) / 100
  }).reduce((previousValue, currentValue) => (currentValue) + previousValue, 0)

  console.log(contracts)

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
              {contracts.map((contract) => {
                const isAccepted = acceptedContracts[contract.uuid] ?? false
                return (
                  <div key={contract.uuid} className={tw('flex flex-row gap-x-2')}>
                    <Checkbox
                      checked={isAccepted}
                      onChange={() => {
                        setAcceptedContracts(prevState => ({
                          ...prevState,
                          [contract.uuid]: !isAccepted,
                        }))
                      }}
                      containerClassName={tw('justify-start')}
                    />
                    <span className={tw('inline-flex gap-x-2')}>
                      {translation.acceptTerms(`${contract.key}`)}
                      <Link
                        href={contract.url} target="_blank"
                        className={tw('flex flex-row gap-x-0.5 items-center')}
                      >
                        <span>(</span>
                        {`${translation.lookAt}`}
                        <ExternalLink size={16}/>
                        <span>)</span>
                    </Link>
                    </span>
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
                  onClick={async (event) => {
                    event.preventDefault()
                    try {
                      for (const value of cart) {
                        await CustomerProductsAPI.book({
                          product_uuid: value.id,
                          product_plan_uuid: value.plan.uuid,
                          accepted_contracts: Object.keys(acceptedContracts),
                          voucher_uuid: value.voucher?.uuid,
                        }, authHeader)
                      }
                      clearCart()
                      router.push('/invoices').catch(console.error)
                    } catch (error) {
                      console.error(error)
                    }
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
