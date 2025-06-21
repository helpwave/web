import type { NextPage } from 'next'
import type { Translation } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { useProductsAllQuery } from '@/api/mutations/product_mutations'
import { Section } from '@/components/layout/Section'
import type {
  ProductPlanTranslation
} from '@/api/dataclasses/product'
import {
  defaultProductPlanTranslation
} from '@/api/dataclasses/product'
import { ChevronLeft, Coins } from 'lucide-react'
import { Table } from '@helpwave/hightide'
import { useAuth, withAuth } from '@/hooks/useAuth'
import { withOrganization } from '@/hooks/useOrganization'
import { useCart } from '@/hooks/useCart'
import { withCart } from '@/hocs/withCart'
import { LoadingAndErrorComponent } from '@helpwave/hightide'
import { useRouter } from 'next/router'
import { Modal } from '@helpwave/hightide'
import { useEffect, useState } from 'react'
import { Input } from '@helpwave/hightide'
import { VoucherAPI } from '@/api/services/voucher'
import type { Voucher } from '@/api/dataclasses/voucher'
import { Chip } from '@helpwave/hightide'
import { useCustomerProductsCalculateQuery } from '@/api/mutations/customer_product_mutations'
import { defaultLocaleFormatters } from '@/utils/locale'
import { ProductAPI } from '@/api/services/product'
import { LoadingAnimation } from '@helpwave/hightide'
import { SolidButton, TextButton } from '@helpwave/hightide'
import clsx from 'clsx'

type ReferralStatus = 'loading' | 'error'
type ReferralData = {
  product: string,
  plan: string,
  voucher?: string,
}


type CartOverviewTranslation = {
  removeFromCart: string,
  overview: string,
  name: string,
  price: string,
  actions: string,
  plan: string,
  back: string,
  checkout: string,
  voucher: string,
  checkAndRedeem: string,
  redeemVoucher: string,
  redeemVoucherFor: (name: string) => string,
  code: string,
  invalidCode: string,
  referral: string,
  referralError: string,
} & ProductPlanTranslation

const defaultCartOverviewTranslations: Translation<CartOverviewTranslation> = {
  en: {
    ...defaultProductPlanTranslation.en,
    removeFromCart: 'Remove',
    overview: 'Cart Overview',
    name: 'Name',
    price: 'Price',
    actions: 'Actions',
    plan: 'Plan',
    back: 'Back',
    checkout: 'Checkout',
    voucher: 'Voucher',
    checkAndRedeem: 'Check and Redeem',
    redeemVoucher: 'Redeem Voucher',
    redeemVoucherFor: (name: string) => `Redeem Voucher for ${name}`,
    code: 'Code',
    invalidCode: 'The provided Code is not valid (for this product), please try a different one.',
    referral: 'Referral',
    referralError: 'The Referral could not be processed.',
  },
  de: {
    ...defaultProductPlanTranslation.de,
    removeFromCart: 'Entfernen',
    overview: 'Warenkorb Übersicht',
    name: 'Name',
    price: 'Preis',
    actions: 'Aktionen',
    plan: 'Plan',
    back: 'Zurück',
    checkout: 'Zur Kasse gehen',
    voucher: 'Gutschein',
    checkAndRedeem: 'Prüfen und Einlösen',
    redeemVoucher: 'Gutschein einlösen',
    redeemVoucherFor: (name: string) => `Gutschein einlösen für ${name}`,
    code: 'Code',
    invalidCode: 'Der eingegebenen Gutschein-Code ist nicht gültig (für dieses Produkt), versuchen Sie einen anderen.',
    referral: 'Überweisung', // TODO fix translation
    referralError: 'Die Überweisung hat nicht funktioniert.',
  }
}


const CartOverview: NextPage = () => {
  const translation = useTranslation(defaultCartOverviewTranslations)
  const router = useRouter()
  const [hasUsedReferral, setHasUsedReferral] = useState<boolean>(false)
  const { authHeader } = useAuth()
  const [referralStatus, setReferralStatus] = useState<ReferralStatus>()
  const { cart, removeItem, updateItem, addItem, isLoading: cartIsLoading } = useCart()
  const [productVoucherModalId, setProductVoucherModalId] = useState<string>()
  const [voucherCode, setVoucherCode] = useState<string>('')
  const [redeemResponse, setRedeemResponse] = useState<string>()
  const { data: products, isError: productsError, isLoading: productsLoading } = useProductsAllQuery()
  const {
    data: prices,
    isError: pricesError,
    isLoading: pricesLoading,
    isRefetching,
    refetch,
  } = useCustomerProductsCalculateQuery(cart.map(item => ({
    productUuid: item.id,
    productPlanUuid: item.plan.uuid,
    voucherUuid: item.voucher?.uuid
  })))

  const localeTranslation = useTranslation(defaultLocaleFormatters)
  useEffect(() => {
    refetch().catch(console.error)
  }, [cart])

  useEffect(() => {
    if (!router.isReady || cartIsLoading || hasUsedReferral) return

    const referralParam = router.query['referral']

    if (!referralParam || typeof referralParam !== 'string') return

    try {
      const decoded = atob(referralParam)
      const parsed: ReferralData = JSON.parse(decoded)

      const check = async () => {
        const products = await ProductAPI.getAvailable(authHeader)
        const product = products.find(value => value.uuid === parsed.product)
        const plan = product?.plan.find(value => value.uuid === parsed.plan)

        // TODO try to parse voucher

        if (!product || !plan) {
          setReferralStatus('error')
          setHasUsedReferral(true)
          return
        }

        if (cart.find(value => value.id === product?.uuid)) {
          // TODO maybe show an additional dialog here
          updateItem({ id: product?.uuid, plan: plan, quantity: 1 })
        } else {
          addItem({ id: product?.uuid, plan: plan, quantity: 1 })
        }
      }

      check().catch((reason) => {
        console.error(reason)
        setReferralStatus('error')
        setHasUsedReferral(true)
      }).then(() => {
        setReferralStatus(undefined)
        setHasUsedReferral(true)
      })
    } catch (err) {
      console.error(err)
      setReferralStatus('error')
      setHasUsedReferral(true)
    }
  }, [router, cart])

  const isError = pricesError || productsError
  const isLoading = pricesLoading || productsLoading || isRefetching

  return (
    <Page pageTitle={titleWrapper(translation.overview)}>
      <Modal
        id="referral-modal"
        isOpen={!!referralStatus}
        onBackgroundClick={referralStatus === 'error' ? () => setReferralStatus(undefined) : undefined}
        onCloseClick={referralStatus === 'error' ? () => setReferralStatus(undefined) : undefined}
        titleText={translation.referral}
        modalClassName="gap-y-2"
      >
        {referralStatus === 'error' ? (
          <span className="text-negative">{translation.referralError}</span>
        ) : (<LoadingAnimation/>)}
      </Modal>
      <Modal
        id="voucher-modal"
        isOpen={!!productVoucherModalId}
        onCloseClick={() => setProductVoucherModalId(undefined)}
        onBackgroundClick={() => setProductVoucherModalId(undefined)}
        titleText={translation.redeemVoucherFor(products?.find(value => value.uuid === productVoucherModalId)?.name ?? '')}
        modalClassName="gap-y-6"
      >
        <div className="col gap-y-2">
          <Input
            value={voucherCode}
            autoFocus={true}
            onChange={text => {
              setVoucherCode(text)
              setRedeemResponse(undefined)
            }}
            label={{ name: translation.code }}
          />
          {redeemResponse && <span className="text-negative">{redeemResponse}</span>}
        </div>
        <SolidButton
          disabled={!voucherCode}
          onClick={async () => {
            try {
              const voucher: Voucher = await VoucherAPI.get(voucherCode, authHeader)
              const cartItem = cart.find(value => value.id === productVoucherModalId)
              if (!cartItem) {
                return
              }
              updateItem({ ...cartItem, voucher: { ...voucher } })
              setProductVoucherModalId(undefined)
            } catch {
              setRedeemResponse(translation.invalidCode)
            }
          }}
        >
          {translation.redeemVoucher}
        </SolidButton>
      </Modal>
      <Section titleText={translation.overview}>
        <LoadingAndErrorComponent isLoading={isLoading} hasError={isError}>
          {products && prices && (
            <Table
              data={cart}
              identifierMapping={dataObject => dataObject.id}
              rowMappingToCells={cartItem => {
                const product = products.find(value => value.uuid === cartItem.id)
                const plan = product?.plan.find(value => value.uuid === cartItem.plan.uuid)
                const voucher = cartItem.voucher

                if (!product || !plan) {
                  return []
                }
                const priceResult = prices.products[product.uuid]!

                // TODO handle not found errors here
                return [
                  <span key={cartItem.id + 'name'}>{product?.name ?? 'Not Found'}</span>,
                  <span key={cartItem.id + 'price'} className={clsx({ 'text-primary': priceResult.saving !== 0 })}>
                    {localeTranslation.formatMoney(priceResult.finalPrice)}
                  </span>,
                  <span key={cartItem.id + 'plan'}>{plan ? translation.productPlan(plan) : ''}</span>,
                  !voucher ? (
                    <TextButton
                      key={cartItem.id + 'voucher-redeem'}
                      onClick={() => setProductVoucherModalId(cartItem.id)}
                    >
                      {translation.redeemVoucher}
                    </TextButton>
                  ) : (<Chip key={cartItem.id + 'voucher'} color="default">{voucher.code}</Chip>),
                  <TextButton
                    key={cartItem.id + 'action'}
                    color="negative"
                    onClick={() => removeItem(cartItem.id)}
                  >
                    {translation.removeFromCart}
                  </TextButton>,
                ]
              }}
              header={[
                <span key="name">{translation.name}</span>,
                <span key="price">{translation.price}</span>,
                <span key="plan">{translation.plan}</span>,
                <span key="voucher">{translation.voucher}</span>,
                <span key="actions">{translation.actions}</span>,
              ]}
            />
          )}
        </LoadingAndErrorComponent>
      </Section>
      <Section className="row justify-between">
        <SolidButton
          className="row items-center"
          onClick={() => router.push('/products/shop')}
        >
          <ChevronLeft size={20} />
          {`${translation.back}`}
        </SolidButton>
        <SolidButton
          className="row items-center"
          onClick={() => router.push('/products/pay')}
          disabled={cart.length === 0}
        >
          <Coins size={20} />
          {`${translation.checkout}`}
        </SolidButton>
      </Section>
    </Page>
  )
}

export default withAuth(withOrganization(withCart(CartOverview)))
