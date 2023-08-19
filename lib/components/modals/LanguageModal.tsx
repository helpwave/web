import { type PropsWithChildren } from 'react'
import type { ModalProps } from './Modal'
import { Modal } from './Modal'
import type { PropsWithLanguage } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import { Select } from '../user_input/Select'
import type { Languages } from '../../hooks/useLanguage'
import { useLanguage } from '../../hooks/useLanguage'
import { Button } from '../Button'
import { tw } from '@twind/core'

const languageDetails = {
  en: 'English',
  de: 'Deutsch'
}

type LanguageModalTranslation = {
  message: string,
  done: string
}

const defaultConfirmDialogTranslation = {
  en: {
    message: 'Choose your language:',
    done: 'Done',
  },
  de: {
    message: 'Wählen Sie Ihre Sprache:',
    done: 'Fertig',
  }
}

type LanguageModalProps = ModalProps & {
    onDone: () => void
}

/**
 * A Modal for selecting the Language
 *
 * The State of open needs to be managed by the parent
 */
export const LanguageModal = ({
  onDone,
  onBackgroundClick,
  ...modalProps
}: PropsWithLanguage<LanguageModalTranslation, PropsWithChildren<LanguageModalProps>>) => {
  const { language, setLanguage } = useLanguage()
  const translation = useTranslation(language, defaultConfirmDialogTranslation)

  return (
    <Modal
      title={translation.message}
      onBackgroundClick={(eventData) => {
        onDone()

        if (onBackgroundClick) {
          onBackgroundClick(eventData)
        }
      }}
      {...modalProps}
    >
      <div className={tw('w-[320px]')}>
        <Select
            value={language}
            options={Object.entries(languageDetails).map(([tag, name]) => ({ label: name, value: tag }))}
            onChange={(language: string) => setLanguage(language as Languages)}
          />
          <div className={tw('flex flex-row mt-3 gap-x-4 justify-end')}>
            <Button autoFocus color="positive" onClick={onDone}>
              {translation.done}
            </Button>
          </div>
      </div>
    </Modal>
  )
}
