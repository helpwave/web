import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page';
import titleWrapper from '@/utils/titleWrapper';

type BillsTranslation = {
  bills: string,
}

const defaultBillsTranslations: Record<Languages, BillsTranslation> = {
  en: {
    bills: 'Bills'
  },
  de: {
    bills: 'Rechnungen'
  }
}

type BillsServerSideProps = {
  jsonFeed: unknown,
}

const Bills: NextPage<PropsForTranslation<BillsTranslation, BillsServerSideProps>> = ({ overwriteTranslation }) => {
  const translation = useTranslation(defaultBillsTranslations, overwriteTranslation)
  return (
    <Page pageTitle={titleWrapper(translation.bills)}>
      <div>This is the {translation.bills} page</div>
    </Page>
  )
}

export default Bills
