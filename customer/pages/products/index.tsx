import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page';
import titleWrapper from '@/utils/titleWrapper';

type ProductsTranslation = {
  products: string,
}

const defaultProductsTranslations: Record<Languages, ProductsTranslation> = {
  en: {
    products: 'Products'
  },
  de: {
    products: 'Produkte'
  }
}

type ProductsServerSideProps = {
  jsonFeed: unknown,
}

const Products: NextPage<PropsForTranslation<ProductsTranslation, ProductsServerSideProps>> = ({ overwriteTranslation }) => {
  const translation = useTranslation(defaultProductsTranslations, overwriteTranslation)
  return (<Page pageTitle={titleWrapper(translation.products)}>This is the {translation.products} Page!</Page>)
}

export default Products
