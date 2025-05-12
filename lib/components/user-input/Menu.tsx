import { useRef, type PropsWithChildren, type ReactNode, type RefObject } from 'react'
import clsx from 'clsx'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { useHoverState } from '../../hooks/useHoverState'

type MenuProps<T> = PropsWithChildren<{
  trigger: (onClick: () => void, ref: RefObject<T>) => ReactNode,
  /**
   * @default 'tl'
   */
  alignment?: 'tl' | 'tr' | 'bl' | 'br' | '_l' | '_r' | 't_' | 'b_',
  showOnHover?: boolean,
  menuClassName?: string,
}>

export type MenuItemProps = {
  onClick?: () => void,
  alignment?: 'left' | 'right',
  className?: string,
}
const MenuItem = ({
  children,
  onClick,
  alignment = 'left',
  className
}: PropsWithChildren<MenuItemProps>) => (
  <div
    className={clsx('block px-3 py-1 bg-menu-background text-menu-text hover:brightness-90', {
      'text-right': alignment === 'right',
      'text-left': alignment === 'left',
    }, className)}
    onClick={onClick}
  >
    {children}
  </div>
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
  const { isHovered: isOpen, setIsHovered: setIsOpen, handlers } = useHoverState({ isDisabled: !showOnHover })
  const triggerRef = useRef<T>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  useOutsideClick([triggerRef, menuRef], () => setIsOpen(false))

  return (
    <div
      className="relative"
      {...handlers}
    >
      {trigger(() => setIsOpen(!isOpen), triggerRef)}
      {isOpen ? (
        <div ref={menuRef} onClick={e => e.stopPropagation()}
             className={clsx('absolute top-full mt-1 py-2 w-60 rounded-lg bg-menu-background text-menu-text ring-1 ring-slate-900/5 text-sm leading-6 font-semibold shadow-md z-[1]', {
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
