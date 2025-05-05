import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { useProductsAllQuery } from '@/api/mutations/product_mutations'
import { Section } from '@/components/layout/Section'
import type { Product, ProductPlanTypeTranslation } from '@/api/dataclasses/product'
import { defaultProductPlanTypeTranslation } from '@/api/dataclasses/product'
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
import { useCustomerProductsCalculateQuery } from '@/api/mutations/customer_product_mutations'
import { Modal } from '@helpwave/common/components/modals/Modal'
import { defaultLocaleFormatters } from '@/utils/locale'
import {SolidButton} from "@helpwave/common/components/Button";

type ProductsTranslation = {
  checkout: string,
  name: string,
  price: string,
  termsAndConditions: string,
  cancel: string,
  pay: string,
  total: string,
  show: string,
  acceptTerms: (name: string) => string,
  bookingSuccessful: string,
  bookingSuccessfulDesc: string,
  bookingFailure: string,
  bookingFailureDesc: string,
  toInvoices: string,
  noTermsAndConditions: string,
} & ProductPlanTypeTranslation

const defaultProductsTranslations: Record<Languages, ProductsTranslation> = {
  en: {
    ...defaultProductPlanTypeTranslation.en,
    checkout: 'Checkout',
    name: 'Name',
    price: 'Price',
    termsAndConditions: 'Terms and Conditions',
    cancel: 'Cancel',
    pay: 'Book for a Fee',
    total: 'Total',
    show: 'Show',
    acceptTerms: (name: string) => `Hereby I accept the terms of use for ${name}.`,
    bookingSuccessful: 'Booking successful',
    bookingSuccessfulDesc: 'You will have access to your product shortly.',
    bookingFailure: 'Booking failed',
    bookingFailureDesc: 'Try again or contact our support at:',
    toInvoices: 'View Invoices',
    noTermsAndConditions: 'No Terms and Conditions required.',
  },
  de: {
    ...defaultProductPlanTypeTranslation.de,
    checkout: 'Kasse',
    name: 'Name',
    price: 'Preis',
    termsAndConditions: 'Nutzungsvereinbarung und -konditionen',
    cancel: 'Abbrechen',
    pay: 'Kostenpflichtig Buchen',
    total: 'Total',
    show: 'Anzeigen',
    acceptTerms: (name: string) => `Hiermit akzeptiere ich die Nutzungsbedingungen von ${name}`,
    bookingSuccessful: 'Buchung erfolgreich',
    bookingSuccessfulDesc: 'In kürze erhalten sie zu dem Produkt.',
    bookingFailure: 'Buchung fehlgeschlagen',
    bookingFailureDesc: 'Versuchen sie es erneut oder kontaktieren sie unseren Support unter:',
    toInvoices: 'Zu den Rechnungen',
    noTermsAndConditions: 'Keine Verträge und Nutzungsbedingungen benötigt',
  }
}

type ContractAcceptedType = Record<string, boolean>
type ResponseModalState = 'failure' | 'success' | 'hidden'
const supportMail = 'support@helpwave.de'

const Payment: NextPage = () => {
  const translation = useTranslation(defaultProductsTranslations)
  const router = useRouter()
  const { authHeader } = useAuth()
  const { cart, clearCart } = useCart()
  const [modalState, setModalState] = useState<ResponseModalState>('hidden')
  const {
    data: contracts,
    isLoading: contractsLoading,
    isError: contractsError
  } = useContractsForProductsQuery(cart.map(value => value.id))
  const [acceptedContracts, setAcceptedContracts] = useState<ContractAcceptedType>({})
  const { data: products, isLoading: productsLoading, isError: productsError } = useProductsAllQuery()
  const {
    data: prices,
    isError: pricesError,
    isLoading: pricesLoading
  } = useCustomerProductsCalculateQuery(cart.map(item => ({
    productUuid: item.id,
    productPlanUuid: item.plan.uuid,
    voucherUuid: item.voucher?.uuid
  })))

  const isError = contractsError || productsError || pricesError
  const isLoading = contractsLoading || productsLoading || pricesLoading

  const allContractsAccepted = !!contracts && contracts.every(contract => acceptedContracts[contract.uuid])
  const localeTranslation = useTranslation(defaultLocaleFormatters)

  return (
    <Page pageTitle={titleWrapper(translation.checkout)}>
      <Modal id="responseModalSuccess" isOpen={modalState === 'success'} titleText={translation.bookingSuccessful}
        modalClassName={'min-h-[120px] justify-between'}>
        <span>{translation.bookingSuccessfulDesc}</span>
        <SolidButton
          onClick={() => router.push('/invoices').catch(console.error)}
          className={'mt-6'}
        >
          {translation.toInvoices}
        </SolidButton>
      </Modal>
      <Modal id="responseModalFailure" isOpen={modalState === 'failure'} titleText={translation.bookingFailure}
        onCloseClick={() => setModalState('hidden')} onBackgroundClick={() => setModalState('hidden')}
        modalClassName={'min-h-[120px] justify-between gap-y-4 bg-negative text-on-negative'}
      >
        <div className={'col gap-y-1'}>
          <span>{translation.bookingFailureDesc}</span>
          <Link href={`mailto:${supportMail}`} className={'text-primary'}>{supportMail}</Link>
        </div>
      </Modal>

      <Section titleText={translation.checkout}>
        <LoadingAndErrorComponent isLoading={isLoading} hasError={isError}>
          {products && prices && (
            <table>
              <thead>
                <tr className={'font-bold'}>
                  <td>{translation.name}</td>
                  <td>{translation.price}</td>
                </tr>
              </thead>
              <tbody>
                {cart.map(cartItem => {
                  const product: Product = products.find(value => value.uuid === cartItem.id)!
                  const plan = product.plan.find(value => value.uuid === cartItem.plan.uuid)!
                  if (!product && !plan) {
                    return []
                  }
                  const price = prices.products[product.uuid]!.finalPrice
                  return (
                    <tr key={cartItem.id}>
                      <td key={`${cartItem.id}+name`}>{`${product.name} (${translation[plan.type]})`}</td>
                      <td key={`${cartItem.id}+price`} className={'float-right'}>{localeTranslation.formatMoney(price)}</td>
                    </tr>
                  )
                })}
                <tr>
                  <td className={'border-t-2'}><span className={'font-semibold'}>{translation.total}</span></td>
                  <td className={'border-t-2'}><span
                    className={'font-semibold float-right'}>{localeTranslation.formatMoney(prices.finalPrice)}</span></td>
                </tr>
              </tbody>
            </table>
          )}
          <h4 className={'font-bold text-xl'}>{translation.termsAndConditions}</h4>
          {products && contracts && (
            <form className={'col gap-y-4'}>
              {contracts.length > 0 ? contracts.map((contract) => {
                const isAccepted = acceptedContracts[contract.uuid] ?? false
                return (
                  <div key={contract.uuid} className={'row'}>
                    <Checkbox
                      checked={isAccepted}
                      onChange={() => {
                        setAcceptedContracts(prevState => ({
                          ...prevState,
                          [contract.uuid]: !isAccepted,
                        }))
                      }}
                      containerClassName={'justify-start'}
                    />
                    <span className={'block'}>
                      {translation.acceptTerms(`${contract.key} `)}
                      <Link
                        href={contract.url} target="_blank"
                        className={'inline-flex flex-row items-center'}
                      >
                        (
                        <span className={'inline-flex flex-row gap-x-0.5 items-center'}>
                          {`${translation.show}`}
                          <ExternalLink size={16} />
                        </span>
                        )
                      </Link>
                    </span>
                  </div>
                )
              }) : <span className={'textstyle-description'}>{translation.noTermsAndConditions}</span>}
              <div className={'row justify-between'}>
                <SolidButton
                  className={'gap-x-2 w-[200px]'}
                  onClick={() => router.push('/products/overview')}
                  type="button"
                >
                  <ChevronLeft />
                  {translation.cancel}
                </SolidButton>
                <SolidButton
                  className={'gap-x-2 w-[200px]'}
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
                      await clearCart()
                      setModalState('success')
                    } catch (error) {
                      setModalState('failure')
                      console.error(error)
                    }
                  }}
                >
                  <Coins />
                  {translation.pay}
                </SolidButton>
              </div>
            </form>
          )}
        </LoadingAndErrorComponent>
      </Section>
    </Page>
  )
}

export default withAuth(withOrganization(withCart(Payment)))
