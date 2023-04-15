import { tw, tx } from '@helpwave/common/twind'
import type { MouseEventHandler, PropsWithChildren } from 'react'

type DialogProps = {
  isOpen: boolean,
  title?: string,
  description?: string,
  onClose: MouseEventHandler<HTMLDivElement>
}
export const Modal = ({ children, isOpen, title, description, onClose }: PropsWithChildren<DialogProps>) => {
  return (
    <div className={tx('fixed inset-0 overflow-y-auto z-[99]', { hidden: !isOpen })}>
      <div className={tw('flex h-screen items-center justify-center bg-black/40')} onClick={onClose}>
        <div className={tw('flex flex-col p-4 bg-white rounded-xl')}>
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
