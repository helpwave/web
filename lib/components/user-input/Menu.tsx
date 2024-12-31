import {
  useRef,
  useState,
  useEffect
} from 'react'
import type {
  AriaAttributes,
  PropsWithChildren,
  ReactNode,
  RefObject, HTMLAttributes
} from 'react'
import { apply } from '@twind/core'
import { tx } from '../../twind'
import { useOutsideClick } from '../../hooks/useOutsideClick'

type MenuProps<T> = PropsWithChildren<{
  /**
   * The builder for the trigger element. Assign the ref and onClick to your element that should be used as a trigger.
   *
   * Accessibility: ensure your trigger element is either a button or has the role="button" in addition to a tabIndex={0} or value > 0
   */
  trigger: (onClick: () => void, ref: RefObject<T>) => ReactNode,
  /**
   * @default 'tl'
   */
  alignment?: 'tl' | 'tr' | 'bl' | 'br' | '_l' | '_r' | 't_' | 'b_',
  showOnHover?: boolean,
  menuClassName?: string,
  containerClassName?: string
}>

export type MenuItemProps = AriaAttributes & Pick<HTMLAttributes<HTMLDivElement>, 'role'> & {
  onClick?: () => void,
  alignment?: 'left' | 'right',
  isDisabled?: boolean,
  className?: string
}

const MenuItem = ({
  children,
  onClick,
  alignment = 'left',
  isDisabled = false,
  className = '',
  role = 'menuitem',
  ...restProps
}: PropsWithChildren<MenuItemProps>) => {
  const isClickable = onClick !== undefined

  return (
    <div
      className={tx(apply('block px-3 py-1 w-full text-sm leading-6 font-semibold'), {
        '@(text-right)': alignment === 'right',
        '@(text-left)': alignment === 'left',
        '@(cursor-pointer)': isClickable && !isDisabled,
        '@(cursor-not-allowed)': isClickable && isDisabled,
        '@(text-hw-grayscale-700 hover:text-hw-grayscale-800 hover:bg-hw-grayscale-50)': !isDisabled,
        '@(text-hw-grayscale-300)': isDisabled,
      }, className)}
      onClick={onClick}
      role={role}
      {...restProps}
    >
      {children}
    </div>
  )
}

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
  containerClassName = '',
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
      className={tx(apply('relative'), containerClassName)}
      onMouseOver={handleHover}
      onMouseLeave={handleLeaveHover}
    >
      {trigger(() => setOpen(!open), triggerRef)}
      {open ? (
        <div ref={menuRef} onClick={e => e.stopPropagation()}
             className={tx(apply('absolute top-full mt-1 py-2 w-60 rounded-lg bg-white ring-1 ring-slate-900/5 shadow-md z-[1]'), {
               '@(top-[8px])': alignment[0] === 't',
               '@(bottom-[8px])': alignment[0] === 'b',
               '@(left-[-8px])': alignment[1] === 'l',
               '@(right-[-8px])': alignment[1] === 'r',
             }, menuClassName)}
             role="menu"
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}

export { Menu, MenuItem }
