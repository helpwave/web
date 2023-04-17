import { tw, tx } from '@helpwave/common/twind'
import type { MouseEventHandler, PropsWithChildren } from 'react'
import { noop } from '../user_input/Input'

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
  onBackgroundClick = noop
}: PropsWithChildren<ModalProps>) => {
  return (
    <div className={tx('fixed inset-0 overflow-y-auto z-[99]', { hidden: !isOpen })}>
      <div
        className={tw('fixed inset-0 flex items-center justify-center bg-black/70')}
        onClick={event => onBackgroundClick && onBackgroundClick(event)}
      >
        <div
          className={tw('absolute flex flex-col p-4 bg-white rounded-xl')}
          onClick={event => event.stopPropagation()}
        >
          {title && (
            <span
              className={tx('text-lg font-semibold', { 'mb-1': description, 'mb-3': !description })}
            >
              {title}
            </span>
          )}
          {description && <span className={tw('mb-3 text-gray-400')}>{description}</span>}
          {children}
        </div>
      </div>
    </div>
  )
}
