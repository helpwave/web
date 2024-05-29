import type { ImageProps } from 'next/image'
import Image from 'next/image'
import { tx } from '@twind/core'

export type TagProps = Omit<ImageProps, 'src'|'alt'>

/**
 * Tag icon from flaticon
 *
 * https://www.flaticon.com/free-icon/label_7625549
 *
 * When using it make attribution
 */
export const TagIcon = ({
  className,
  width = 16,
  height = 16,
  ...props
}: TagProps) => {
  return (
    <Image
      {...props}
      width={width}
      height={height}
      alt=""
      src="https://cdn.helpwave.de/icons/label.png"
      className={tx(`w-[${width}px] h-[${height}px]`, className)}
    />
  )
}
