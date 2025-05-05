import type { ImageProps } from 'next/image'
import Image from 'next/image'

export type TagProps = Omit<ImageProps, 'src'|'alt'>

/**
 * Tag icon from flaticon
 *
 * https://www.flaticon.com/free-icon/price-tag_721550?term=label&page=1&position=8&origin=tag&related_id=721550
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
      className={className}
    />
  )
}
