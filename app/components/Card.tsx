import { tx } from '@helpwave/common/twind/index'
import type { PropsWithChildren } from 'react'
import type { Class } from '@twind/core'

export type CardProps = {
  isSelected?: boolean,
  onTileClicked?: () => void,
  classes?: Class[]
}

export const Card = ({
  children,
  isSelected = false,
  onTileClicked = () => undefined,
  classes = [],
}: PropsWithChildren<CardProps>) => {
  return (
    <div onClick={onTileClicked}
         className={tx('cursor-pointer rounded-md py-2 px-4 border border-2 hover:border-hw-primary-700 w-full', { 'border-hw-primary-700': isSelected }, ...classes)}>
      {children}
    </div>
  )
}
