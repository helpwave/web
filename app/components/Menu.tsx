import React, { useRef } from 'react'
import type { PropsWithChildren, ReactNode, RefObject } from 'react'
import { useOutsideClick } from '../hooks/useOutsideClick'

type MenuProps<T> = PropsWithChildren<{
  trigger: (onClick: () => void, ref: RefObject<T>) => ReactNode
}>

const MenuItem = ({ children, onClick }: PropsWithChildren<{ onClick?: () => void }>) => (
  <div className="block px-3 py-1 hover:bg-slate-100" onClick={onClick}>{children}</div>
)

// TODO: it is quite annoying that the type for the ref has to be specified manually, is there some solution around this?
const Menu = <T extends HTMLElement>({ trigger, children }: MenuProps<T>) => {
  const [open, setOpen] = React.useState(false)
  const triggerRef = useRef<T>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  useOutsideClick([triggerRef, menuRef], () => setOpen(false))

  return (
    <div className="relative">
      {trigger(() => setOpen(!open), triggerRef)}
      {open ? (
          <div ref={menuRef} onClick={e => e.stopPropagation()} className="absolute top-full mt-1 py-2 w-40 rounded-lg bg-white ring-1 ring-slate-900/5 text-sm leading-6 font-semibold text-slate-700 shadow-md">
            {children}
          </div>
      ) : null}
    </div>
  )
}

export { Menu, MenuItem }
