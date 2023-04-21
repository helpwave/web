import { tw, tx } from '../../twind'
import type { MouseEventHandler, PropsWithChildren } from 'react'

export type ModalProps = {
  isOpen: boolean,
  title?: string,
  description?: string,
  onBackgroundClick?: MouseEventHandler<HTMLDivElement>
}
export const Modal = ({
  children,
  isOpen,
  title,
  description,
  onBackgroundClick
}: PropsWithChildren<ModalProps>) => {
  return (
    <div className={tx('fixed inset-0 overflow-y-auto z-[99]', { hidden: !isOpen })}>
      <div
        className={tw('fixed inset-0 h-screen w-screen bg-black/70')}
        onClick={onBackgroundClick}
      />
      <div className={tw('fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col p-4 bg-white rounded-xl shadow-xl')}>
        {title && (
          <span className={tx('text-lg font-semibold', { 'mb-1': description, 'mb-3': !description })}>
              {title}
          </span>
        )}
        {description && <span className={tw('mb-3 text-gray-400')}>{description}</span>}
        {children}
      </div>
    </div>
  )
}
