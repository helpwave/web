import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { useProductsAllQuery } from '@/api/mutations/product_mutations'
import { Section } from '@/components/layout/Section'
import { tw, tx } from '@twind/core'
import type {
  ProductPlanTranslation
} from '@/api/dataclasses/product'
import {
  defaultProductPlanTranslation
} from '@/api/dataclasses/product'
import { Button } from '@helpwave/common/components/Button'
import { ChevronLeft, Coins } from 'lucide-react'
import { Table } from '@helpwave/common/components/Table'
import { useAuth, withAuth } from '@/hooks/useAuth'
import { withOrganization } from '@/hooks/useOrganization'
import { useCart } from '@/hooks/useCart'
import { withCart } from '@/hocs/withCart'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { useRouter } from 'next/router'
import { Modal } from '@helpwave/common/components/modals/Modal'
import { useEffect, useState } from 'react'
import { Input } from '@helpwave/common/components/user-input/Input'
import { VoucherAPI } from '@/api/services/voucher'
import type { Voucher } from '@/api/dataclasses/voucher'
import { Chip } from '@helpwave/common/components/ChipList'
import { useCustomerProductsCalculateQuery } from '@/api/mutations/customer_product_mutations'
import { defaultLocaleFormatters } from '@/utils/locale'
import { ProductAPI } from '@/api/services/product'
import { LoadingAnimation } from '@helpwave/common/components/LoadingAnimation'

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

const defaultCartOverviewTranslations: Record<Languages, CartOverviewTranslation> = {
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
        modalClassName={tw('gap-y-2')}
      >
        {referralStatus === 'error' ? (
          <span className={tw('text-hw-negative-500')}>{translation.referralError}</span>
        ) : (<LoadingAnimation/>)}
      </Modal>
      <Modal
        id="voucher-modal"
        isOpen={!!productVoucherModalId}
        onCloseClick={() => setProductVoucherModalId(undefined)}
        onBackgroundClick={() => setProductVoucherModalId(undefined)}
        titleText={translation.redeemVoucherFor(products?.find(value => value.uuid === productVoucherModalId)?.name ?? '')}
        modalClassName={tw('gap-y-6')}
      >
        <div className={tw('gap-y-2')}>
          <Input
            value={voucherCode}
            autoFocus={true}
            onChange={text => {
              setVoucherCode(text)
              setRedeemResponse(undefined)
            }}
            label={{ name: translation.code }}
          />
          {redeemResponse && <span className={tw('text-hw-negative-400')}>{redeemResponse}</span>}
        </div>
        <Button
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
        </Button>
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
                  <span key={cartItem.id + 'price'} className={tx({ 'text-hw-primary-500': priceResult.saving !== 0 })}>
                    {localeTranslation.formatMoney(priceResult.finalPrice)}
                  </span>,
                  <span key={cartItem.id + 'plan'}>{plan ? translation.productPlan(plan) : ''}</span>,
                  !voucher ? (
                    <Button
                      variant="text"
                      key={cartItem.id + 'voucher-redeem'}
                      onClick={() => setProductVoucherModalId(cartItem.id)}
                    >
                      {translation.redeemVoucher}
                    </Button>
                  ) : (<Chip key={cartItem.id + 'voucher'} color="hw-primary">{voucher.code}</Chip>),
                  <Button
                    variant="text"
                    key={cartItem.id + 'action'}
                    color="hw-negative"
                    onClick={() => removeItem(cartItem.id)}
                  >
                    {translation.removeFromCart}
                  </Button>,
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
      <Section className={tw('flex flex-row justify-between')}>
        <Button
          className={tw('flex flex-row items-center gap-x-2')}
          onClick={() => router.push('/products/shop')}
        >
          <ChevronLeft size={20} />
          {`${translation.back}`}
        </Button>
        <Button
          className={tw('flex flex-row items-center gap-x-2')}
          onClick={() => router.push('/products/pay')}
          disabled={cart.length === 0}
        >
          <Coins size={20} />
          {`${translation.checkout}`}
        </Button>
      </Section>
    </Page>
  )
}

export default withAuth(withOrganization(withCart(CartOverview)))
