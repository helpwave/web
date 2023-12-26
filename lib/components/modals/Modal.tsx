import { useContext, useEffect, type MouseEventHandler, type PropsWithChildren, type ReactNode } from 'react'
import ReactDOM from 'react-dom'
import { X } from 'lucide-react'
import { Span } from '../Span'
import { tx, tw } from '../../twind'
import type { Languages } from '../../hooks/useLanguage'
import type { PropsWithLanguage } from '../../hooks/useTranslation'
import { useTranslation } from '../../hooks/useTranslation'
import { ModalContext } from './ModalRegister'

type ModalHeaderTranslation = {
  close: string
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
  title?: ReactNode,
  titleText?: string,
  description?: ReactNode,
  descriptionText?: string
}

/**
 * A default Header to be used by modals to have a uniform design
 */
export const ModalHeader = ({
  language,
  onCloseClick,
  title,
  titleText = '',
  description,
  descriptionText = ''
}: PropsWithLanguage<ModalHeaderTranslation, ModalHeaderProps>) => {
  const translation = useTranslation(language, defaultModalHeaderTranslation)
  return (
    <div className={tw('flex flex-col')}>
      <div className={tw('flex flex-row justify-between items-start gap-x-8')}>
        {title ?? (
          <Span type="modalTitle" className={tx({
            'mb-1': description || descriptionText,
          })}>
            {titleText}
          </Span>
        )}
        {!!onCloseClick && (
          <button className={tw('flex flex-row gap-x-2')} onClick={onCloseClick}>
            <Span>{translation.close}</Span>
            <X/>
          </button>
        )}
      </div>
      {description ?? (<Span type="description">{descriptionText}</Span>)}
    </div>
  )
}

export const modalRootName = 'modal-root'

export type ModalProps = {
  id: string,
  isOpen: boolean,
  onBackgroundClick?: MouseEventHandler<HTMLDivElement>,
  backgroundClassName?: string,
  modalClassName?: string
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
  ...modalHeaderProps
}: PropsWithChildren<ModalProps>) => {
  const modalRoot = document.getElementById(modalRootName)
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

  const backgroundNormal = (
    <div
      className={tx('fixed inset-0 h-screen w-screen bg-black/70', backgroundClassName)}
    />
  )

  const clickTargetBackground = (
    <div
      className={tx('fixed inset-0 h-screen w-screen')}
      onClick={onBackgroundClick}
    />
  )

  return ReactDOM.createPortal(
    <div className={tx('fixed inset-0 overflow-y-auto z-[99]')} id={id}>
      {isLast && register.length === 1 && backgroundNormal}
      {clickTargetBackground}
      <div
        className={tx('fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col p-4 bg-white rounded-xl shadow-xl', modalClassName)}>
        <ModalHeader {...modalHeaderProps} />
        {children}
      </div>
      {isSecondLast && register.length > 1 && backgroundNormal}
    </div>,
    modalRoot,
    id
  )
}
