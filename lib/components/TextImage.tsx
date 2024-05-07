import { tw, tx } from '@twind/core'
import { colors } from '../twind/config'
import { Chip } from './ChipList'
import { Span } from './Span'

const textImageColor = ['primary', 'secondary', 'secondaryDark', 'red'] as const
type TextImageColor = typeof textImageColor[number]

export type TextImageProps = {
  title: string,
  description: string,
  imageUrl: string,
  color?: TextImageColor,
  badge?: string,
  contentClassName?: string,
  className?: string
}

/**
 * A Component for layering a Text upon a Image
 */
export const TextImage = ({
  title,
  description,
  imageUrl,
  color = 'primary',
  badge,
  contentClassName = '',
  className = '',
}: TextImageProps) => {
  const colorMapping: Record<TextImageColor, string> = {
    primary: colors.primary[600],
    secondary: colors.secondary[400],
    secondaryDark: colors.secondary[800],
    red: colors.negative[700]
  }

  const withTransparency = (color: string, transparency: string) => {
    return color.padEnd(9, transparency)
  }

  return (
    <div
      className={tx('relative rounded-2xl mx-4 w-full h-full', className)}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
      }}>
      <div
        className={tx(`flex flex-col px-6 py-12 rounded-2xl`, contentClassName)}
        style={{
          backgroundImage: `linear-gradient(to right, ${colorMapping[color]} 30%, ${withTransparency(colorMapping[color], '55')})`
        }}
      >
        {badge && (
          <Chip variant="fullyRounded" className={tw(`!bg-white !text-[${colorMapping[color]}] mb-2 !px-4`)}>
            <Span className={tw('text-lg')}>{badge}</Span>
          </Chip>
        )}
        <div className={tw('flex flex-col gap-y-1 text-white')}>
          <Span type="title" className={tw('!text-3xl')}>{title}</Span>
          <Span>{description}</Span>
        </div>
      </div>
    </div>
  )
}
