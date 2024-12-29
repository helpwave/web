import { Info, X } from 'lucide-react'
import type { TileProps } from '../layout/Tile'
import { Tile } from '../layout/Tile'

export type TileExampleProps = Omit<TileProps, 'prefix' | 'suffix'> & {
  prefix: boolean,
  suffix: boolean,
}

/**
 * An Example for using the tile
 */
export const TileExample = ({
  prefix,
  suffix,
  ...restProps
}: TileExampleProps) => {
  return (
    <Tile
      {...restProps}
      prefix={prefix ? <Info size={20}/> : undefined}
      suffix={suffix ? <X size={20}/> : undefined}
    />
  )
}
