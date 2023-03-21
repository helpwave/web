import { tx } from '@helpwave/common/twind/index'
import type { PropsWithChildren } from 'react'

export type CardProps = {
  isSelected?: boolean,
  onTileClicked?: () => void
}

export const Card = ({
  children,
  isSelected = false,
  onTileClicked = () => undefined
}: PropsWithChildren<CardProps>) => {
  return (
    <div onClick={onTileClicked}
         className={tx('cursor-pointer rounded-md py-2 px-4 border border-2 hover:border-hw-primary-700 w-full', { 'border-hw-primary-700': isSelected })}>
      {children}
    </div>
  )
}
