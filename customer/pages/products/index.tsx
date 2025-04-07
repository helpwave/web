import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { useProductsQuery } from '@/api/mutations/product_mutations'
import { Section } from '@/components/layout/Section'
import { tw } from '@helpwave/style-themes/twind'
import { LoadingAnimation } from '@helpwave/common/components/LoadingAnimation'
import type { ProductPlan } from '@/api/dataclasses/product'

type ProductsTranslation = {
  products: string,
} & Record<ProductPlan, string>

const defaultProductsTranslations: Record<Languages, ProductsTranslation> = {
  en: {
    products: 'Products',
    once: 'Once',
    monthly: 'Monthly',
    yearly: 'Yearly',
  },
  de: {
    products: 'Produkte',
    once: 'Einmalig',
    monthly: 'Monatlich',
    yearly: 'Jährlich',
  }
}

type ProductsServerSideProps = {
  jsonFeed: unknown,
}

const Products: NextPage<PropsForTranslation<ProductsTranslation, ProductsServerSideProps>> = ({ overwriteTranslation }) => {
  const translation = useTranslation(defaultProductsTranslations, overwriteTranslation)
  const { data, isError, isLoading } = useProductsQuery()
  return (
    <Page pageTitle={titleWrapper(translation.products)} mainContainerClassName={tw('min-h-[80vh]')}>
      <Section titleText={translation.products}>
        {isError && (<span className={tw('There was an Error')}></span>)}
        {!isError && isLoading && (<LoadingAnimation/>)}
        {!isError && !isLoading && (
          <div className={tw('flex flex-wrap gap-x-8 gap-y-12')}>
            {data.map((product, index) => (
              <div key={index} className={tw('flex flex-col gap-y-2 min-w-[200px] max-w-[200px] bg-hw-primary-500 text-white px-4 py-2 rounded-md')}>
                <h4 className={tw('font-bold font-space text-xl')}>{product.name}</h4>
                <div className={tw('flex flex-row justify-between')}>
                  <span className={tw('font-semibold text-lg')}>{`${product.price}€`}</span>
                  {translation[product.plan]}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </Page>
  )
}

export default Products
