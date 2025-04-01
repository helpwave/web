import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { useProductsAllQuery } from '@/api/mutations/product_mutations'
import { Section } from '@/components/layout/Section'
import { tw } from '@twind/core'
import type { ProductPlanTranslation } from '@/api/dataclasses/product'
import { defaultProductPlanTranslation } from '@/api/dataclasses/product'
import { Button } from '@helpwave/common/components/Button'
import { ChevronLeft, Coins } from 'lucide-react'
import { Table } from '@helpwave/common/components/Table'
import { withAuth } from '@/hooks/useAuth'
import { withOrganization } from '@/hooks/useOrganization'
import { useCart } from '@/hooks/useCart'
import { withCart } from '@/hocs/withCart'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { useRouter } from 'next/router'

type CartOverviewTranslation = {
  removeFromCart: string,
  overview: string,
  name: string,
  price: string,
  actions: string,
  plan: string,
  back: string,
  checkout: string,
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
  }
}


const CartOverview: NextPage = () => {
  const translation = useTranslation(defaultCartOverviewTranslations)
  const router = useRouter()
  const { cart, removeItem } = useCart()
  const { data: products, isError, isLoading } = useProductsAllQuery()

  return (
    <Page pageTitle={titleWrapper(translation.overview)}>
      <Section titleText={translation.overview}>
        <LoadingAndErrorComponent isLoading={isLoading} hasError={isError}>
          {products && (
            <Table
              data={cart}
              identifierMapping={dataObject => dataObject.id}
              rowMappingToCells={dataObject => {
                const product = products.find(value => value.uuid === dataObject.id)
                const plan = product?.plan.find(value => value.uuid === dataObject.plan.uuid)
                // TODO handle not found errors here
                return [
                  <span key={dataObject.id + 'name'}>{product?.name ?? 'Not Found'}</span>,
                  <span key={dataObject.id + 'price'}>{(plan?.costEuro ?? '-') + '€'}</span>,
                  <span key={dataObject.id + 'plan'}>{translation[plan?.type ?? 'monthly']}</span>,
                  <Button
                    variant="text"
                    key={dataObject.id + 'action'}
                    color="hw-negative"
                    onClick={() => removeItem(dataObject.id)}
                  >
                    {translation.removeFromCart}
                  </Button>,
                ]
              }}
              header={[
                <span key="name">{translation.name}</span>,
                <span key="price">{translation.price}</span>,
                <span key="plan">{translation.plan}</span>,
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
          <ChevronLeft size={20}/>
          {`${translation.back}`}
        </Button>
        <Button
          className={tw('flex flex-row items-center gap-x-2')}
          onClick={() => router.push('/products/pay')}
          disabled={cart.length === 0}
        >
          <Coins size={20}/>
          {`${translation.checkout}`}
        </Button>
      </Section>
    </Page>
  )
}

export default withAuth(withOrganization(withCart(CartOverview)))
