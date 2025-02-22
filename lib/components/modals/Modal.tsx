import { useContext, useEffect, type MouseEventHandler, type PropsWithChildren, type ReactNode } from 'react'
import ReactDOM from 'react-dom'
import { X } from 'lucide-react'
import { tx, tw } from '../../twind'
import type { Languages } from '../../hooks/useLanguage'
import type { PropsForTranslation } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import { Tooltip } from '../Tooltip'
import { ModalContext } from './ModalRegister'

type ModalHeaderTranslation = {
  close: string,
}

const defaultModalHeaderTranslation: Record<Languages, ModalHeaderTranslation> = {
  en: {
    close: 'Close'
  },
  de: {
    close: 'Schließen'
  }
}

export type ModalHeaderProps = {
  onCloseClick?: () => void,
  /** The title of the Modal. If you want to only set the text use `titleText` instead */
  title?: ReactNode,
  /** The title text of the Modal. If you want to set a custom title use `title` instead */
  titleText?: string,
  /** The description of the Modal. If you want to only set the text use `descriptionText` instead */
  description?: ReactNode,
  /** The description text of the Modal. If you want to set a custom description use `description` instead */
  descriptionText?: string,
}

/**
 * A default Header to be used by modals to have a uniform design
 */
export const ModalHeader = ({
                              overwriteTranslation,
                              onCloseClick,
                              title,
                              titleText = '',
                              description,
                              descriptionText = ''
                            }: PropsForTranslation<ModalHeaderTranslation, ModalHeaderProps>) => {
  const translation = useTranslation(defaultModalHeaderTranslation, overwriteTranslation)
  return (
    <div className={tw('flex flex-col')}>
      <div className={tw('flex flex-row justify-between items-start gap-x-8')}>
        {title ?? (
          <span className={tx('textstyle-title-normal', {
            'mb-1': description || descriptionText,
          })}>
            {titleText}
          </span>
        )}
        {!!onCloseClick && (
          <Tooltip tooltip={translation.close}>
            <button className={tw('flex flex-row bg-gray-200 hover:bg-gray-300 rounded-md p-1')} onClick={onCloseClick}>
              <X/>
            </button>
          </Tooltip>
        )}
      </div>
      {description ?? (<span className={tw('textstyle-description')}>{descriptionText}</span>)}
    </div>
  )
}

export const modalRootName = 'modal-root'

export type ModalProps = {
  id: string,
  isOpen: boolean,
  onBackgroundClick?: MouseEventHandler<HTMLDivElement>,
  backgroundClassName?: string,
  modalClassName?: string,
  containerClassName?: string,
} & ModalHeaderProps

/**
 * A Generic Modal Window
 *
 * The state needs to be managed by the parent of this component
 *
 * DO NOT Conditionally render this always use the isOpen to ensure that the ModalRegister is working properly
 */
export const Modal = ({
                        children,
                        id,
                        isOpen,
                        onBackgroundClick,
                        backgroundClassName = '',
                        modalClassName = '',
                        containerClassName = '',
                        ...modalHeaderProps
                      }: PropsWithChildren<ModalProps>) => {
  const modalRoot = typeof window !== 'undefined' ? document.getElementById(modalRootName) : null
  const {
    register,
    addToRegister,
    removeFromRegister
  } = useContext(ModalContext)

  if (!id) {
    console.error('the id cannot be empty')
  }

  useEffect(() => {
    if (isOpen) {
      addToRegister(id)
    } else {
      removeFromRegister(id)
    }
  }, [addToRegister, id, removeFromRegister, isOpen])

  if (modalRoot === null || !isOpen) return null

  const isLast = register.length < 1 || register[register.length - 1] === id
  const isSecondLast = register.length < 2 || register[register.length - 2] === id

  return ReactDOM.createPortal(
    <div className={tx('@(fixed inset-0 overflow-y-auto z-[99])', containerClassName)} id={id}>
      {isLast && (
        <div
          className={tx('fixed inset-0 h-screen w-screen', backgroundClassName, {
            'bg-black/70': isLast && register.length === 1,
          })}
          onClick={onBackgroundClick}
        />
      )}
      <div
        className={tx('fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col p-4 bg-white rounded-xl shadow-xl', modalClassName)}>
        <ModalHeader {...modalHeaderProps} />
        {children}
      </div>
      {!isLast && (
        <div
          className={tx('fixed inset-0 h-screen w-screen', backgroundClassName, {
            'bg-black/70': isSecondLast && register.length > 1,
          })}
        />
      )}
    </div>,
    modalRoot,
    id
  )
}
