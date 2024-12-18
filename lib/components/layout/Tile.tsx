import type { ReactNode } from 'react'
import Image from 'next/image'
import { tw, tx } from '../../twind'

export type TileProps = {
  title: { value: string, className?: string },
  description?: { value: string, className?: string},
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
        <span className={title.className}>{title.value}</span>
        {!!description &&
          <span className={description.className ?? tw('textstyle-description')}>{description.value}</span>}
      </div>
      {suffix}
    </div>
  )
}

type ImageLocation = 'prefix' | 'suffix'
type ImageSize = {
  width: number,
  height: number
}

export type TileWithImageProps = Omit<TileProps, 'suffix' | 'prefix'> & {
  url: string,
  imageLocation?: ImageLocation,
  imageSize?: ImageSize,
  imageClassName?: string
}

/**
 * A Tile with an image as prefix or suffix
 */
export const TileWithImage = ({
  url,
  imageLocation = 'prefix',
  imageSize = { width: 24, height: 24 },
  imageClassName = '',
  ...tileProps
}: TileWithImageProps) => {
  const image = <Image src={url} alt="" {...imageSize} className={tx(imageClassName)}/>
  return (
    <Tile
      {...tileProps}
      prefix={imageLocation === 'prefix' ? image : undefined}
      suffix={imageLocation === 'suffix' ? image : undefined}
    />
  )
}
