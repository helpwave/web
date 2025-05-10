import { type PropsWithChildren } from 'react'
import type { PropsForTranslation } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import { Select } from '../user-input/Select'
import type { Languages } from '../../hooks/useLanguage'
import { useLanguage } from '../../hooks/useLanguage'
import { SolidButton } from '../Button'
import { Modal, type ModalProps } from './Modal'

const languageDetails = {
  en: 'English',
  de: 'Deutsch'
}

type LanguageModalTranslation = {
  message: string,
  done: string,
}

const defaultConfirmDialogTranslation = {
  en: {
    message: 'Choose your language',
    done: 'Done',
  },
  de: {
    message: 'Wählen Sie Ihre Sprache',
    done: 'Fertig',
  }
}

type LanguageModalProps = ModalProps & {
    onDone: () => void,
}

/**
 * A Modal for selecting the Language
 *
 * The State of open needs to be managed by the parent
 */
export const LanguageModal = ({
  overwriteTranslation,
  onDone,
  onBackgroundClick,
  ...modalProps
}: PropsForTranslation<LanguageModalTranslation, PropsWithChildren<LanguageModalProps>>) => {
  const { language, setLanguage } = useLanguage()
  const translation = useTranslation(defaultConfirmDialogTranslation, overwriteTranslation)

  return (
    <Modal
      titleText={translation.message}
      onBackgroundClick={(eventData) => {
        onDone()

        if (onBackgroundClick) {
          onBackgroundClick(eventData)
        }
      }}
      {...modalProps}
    >
      <div className="w-[320px]">
        <Select
            className="mt-2"
            value={language}
            options={Object.entries(languageDetails).map(([tag, name]) => ({ label: name, value: tag }))}
            onChange={(language: string) => setLanguage(language as Languages)}
          />
          <div className="row mt-3 gap-x-4 justify-end">
            <SolidButton autoFocus color="positive" onClick={onDone}>
              {translation.done}
            </SolidButton>
          </div>
      </div>
    </Modal>
  )
}
