import { tw, tx } from '../../twind'
import type { MouseEventHandler, PropsWithChildren } from 'react'
import ReactDOM from 'react-dom'
import { useContext, useEffect } from 'react'
import { ModalContext } from './ModalRegister'

export const modalRootName = 'modal-root'

export type ModalProps = {
  id: string,
  isOpen: boolean,
  title?: string,
  description?: string,
  onBackgroundClick?: MouseEventHandler<HTMLDivElement>,
  backgroundClassName?: string,
  modalClassName?: string
}

/**
 * A Generic Modal Window
 *
 * The state needs to be managed by the parent of this component
 */
export const Modal = ({
  children,
  id,
  isOpen,
  title,
  description,
  onBackgroundClick,
  backgroundClassName = '',
  modalClassName = ''
}: PropsWithChildren<ModalProps>) => {
  const modalRoot = document.getElementById(modalRootName)
  const { register, addToRegister, removeFromRegister } = useContext(ModalContext)

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
        {title && (
          <span className={tx('text-lg font-semibold', { 'mb-1': description, 'mb-3': !description })}>
              {title}
          </span>
        )}
        {description && <span className={tw('mb-3 text-gray-400')}>{description}</span>}
        {children}
      </div>
      {isSecondLast && register.length > 1 && backgroundNormal}
    </div>,
    modalRoot,
    id
  )
}
