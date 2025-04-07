import type { PropsWithChildren } from 'react'
import { useState } from 'react'
import { LanguageModal } from '../modals/LanguageModal'
import { tw } from '@helpwave/style-themes/twind'
import type { Languages } from '../../hooks/useLanguage'
import { SolidButton } from '../Button'
import type { PropsForTranslation } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'

type LanguageHeaderTranslation = {
  languages: string,
}

const defaultLanguageHeaderTranslation: Record<Languages, LanguageHeaderTranslation> = {
  en: {
    languages: 'Language'
  },
  de: {
    languages: 'Sprache'
  }
}
export const LanguageHeader = ({
  overwriteTranslation,
  children
}: PropsForTranslation<LanguageHeaderTranslation, PropsWithChildren>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const translation = useTranslation(defaultLanguageHeaderTranslation, overwriteTranslation)
  return (
    <>
      <LanguageModal
        id="languageModal"
        isOpen={isOpen}
        onDone={() => setIsOpen(false)}
        onCloseClick={() => setIsOpen(false)}
        onBackgroundClick={() => setIsOpen(false)}
      />
      <div className={tw('flex flex-row h-8 w-full py-2 mb-2 justify-end items-center')}>
        <SolidButton
          variant="text-border"
          onClick={() => setIsOpen(true)}
          className={tw('!py-[2px] !px-1')}
        >
          {translation.languages}
        </SolidButton>
      </div>
      {children}
    </>
  )
}
