import { useRef, useState, type PropsWithChildren, type ReactNode, type RefObject, useEffect } from 'react'
import { tw, tx } from '../../twind'
import { useOutsideClick } from '../../hooks/useOutsideClick'

type MenuProps<T> = PropsWithChildren<{
  trigger: (onClick: () => void, ref: RefObject<T>) => ReactNode,
  /**
   * @default 'tl'
   */
  alignment?: 'tl' | 'tr' | 'bl' | 'br' | '_l' | '_r' | 't_' | 'b_',
  showOnHover?: boolean,
  menuClassName?: string
}>

const MenuItem = ({
  children,
  onClick,
  alignment = 'left'
}: PropsWithChildren<{ onClick?: () => void, alignment?: 'left' | 'right' }>) => (
  <div className={tx('block px-3 py-1 hover:bg-slate-100', {
    'text-right': alignment === 'right',
    'text-left': alignment === 'left',
  })} onClick={onClick}>{children}</div>
)

// TODO: it is quite annoying that the type for the ref has to be specified manually, is there some solution around this?
/**
 * A Menu Component to allow the user to see different functions
 */
const Menu = <T extends HTMLElement>({
  trigger,
  children,
  alignment = 'tl',
  showOnHover = false,
  menuClassName = '',
}: MenuProps<T>) => {
  const [open, setOpen] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout>()
  const triggerRef = useRef<T>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  useOutsideClick([triggerRef, menuRef], () => setOpen(false))

  const handleHover = () => {
    if (showOnHover) {
      clearTimeout(timer)
      setOpen(true)
    }
  }

  const handleLeaveHover = () => {
    if (showOnHover) {
      setTimer(setTimeout(() => {
        setOpen(false)
      }, 200))
    }
  }

  useEffect(() => {
    if (timer) {
      return () => {
        clearTimeout(timer)
      }
    }
  })

  return (
    <div
      className={tw('relative')}
      onMouseOver={handleHover}
      onMouseLeave={handleLeaveHover}
    >
      {trigger(() => setOpen(!open), triggerRef)}
      {open ? (
        <div ref={menuRef} onClick={e => e.stopPropagation()}
             className={tx('absolute top-full mt-1 py-2 w-40 rounded-lg bg-white ring-1 ring-slate-900/5 text-sm leading-6 font-semibold text-slate-700 shadow-md z-[1]', {
               '    top-[8px]': alignment[0] === 't',
               ' bottom-[8px]': alignment[0] === 'b',
               '  left-[-8px]': alignment[1] === 'l',
               ' right-[-8px]': alignment[1] === 'r',
             }, menuClassName)}>
          {children}
        </div>
      ) : null}
    </div>
  )
}

export { Menu, MenuItem }
