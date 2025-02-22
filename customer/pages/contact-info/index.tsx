import type { NextPage } from 'next'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'

type ContactInfoTranslation = {
  contactInfo: string,
}

const defaultContactInfoTranslations: Record<Languages, ContactInfoTranslation> = {
  en: {
    contactInfo: 'Contact Information'
  },
  de: {
    contactInfo: 'Kontakt Informationen'
  }
}

type ContactInfoServerSideProps = {
  jsonFeed: unknown,
}

const ContactInfo: NextPage<PropsForTranslation<ContactInfoTranslation, ContactInfoServerSideProps>> = ({ overwriteTranslation }) => {
  const translation = useTranslation(defaultContactInfoTranslations, overwriteTranslation)
  return (<Page pageTitle={titleWrapper(translation.contactInfo)}>This is the {translation.contactInfo} page</Page>)
}

export default ContactInfo
