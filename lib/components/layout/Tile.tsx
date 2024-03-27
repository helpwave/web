import type { ReactNode } from 'react'
import { tw, tx } from '../../twind'
import type { SpanType } from '../Span'
import { Span } from '../Span'

export type TileProps = {
  title: { value: string, className?: string, type?: SpanType },
  description?: { value: string, className?: string, type?: SpanType },
  prefix?: ReactNode,
  suffix?: ReactNode,
  className?: string
}

/**
 * A component for creating a tile similar to the flutter ListTile
 */
export const Tile = ({
  title,
  description,
  prefix,
  suffix,
  className
}: TileProps) => {
  return (
    <div className={tx('flex flex-row gap-x-4 w-full items-center', className)}>
      {prefix}
      <div className={tw('flex flex-col w-full')}>
        <Span className={title.className} type={title.type}>{title.value}</Span>
        {!!description && <Span type={description.type ?? 'description'} className={description.className}>{description.value}</Span>}
      </div>
      {suffix}
    </div>
  )
}
