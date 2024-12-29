import { tw, tx } from '@twind/core'
import { colors } from '../twind/config'
import type { Languages } from '../hooks/useLanguage'
import type { PropsForTranslation } from '../hooks/useTranslation'
import { useTranslation } from '../hooks/useTranslation'
import { Chip } from './ChipList'
import { Span } from './Span'

type TextImageColor = 'primary'| 'secondary'| 'secondaryDark'| 'red'

type TextImageTranslation = {
  showMore: string,
}

const defaultTextImageTranslation: Record<Languages, TextImageTranslation> = {
  de: {
    showMore: 'Mehr anzeigen'
  },
  en: {
    showMore: 'Show more'
  }
}

export type TextImageProps = {
  title: string,
  description: string,
  imageUrl: string,
  onShowMoreClicked?: () => void,
  color?: TextImageColor,
  badge?: string,
  contentClassName?: string,
  className?: string,
}

/**
 * A Component for layering a Text upon a Image
 */
export const TextImage = ({
  overwriteTranslation,
  title,
  description,
  imageUrl,
  onShowMoreClicked,
  color = 'primary',
  badge,
  contentClassName = '',
  className = '',
}: PropsForTranslation<TextImageTranslation, TextImageProps>) => {
  const translation = useTranslation(defaultTextImageTranslation, overwriteTranslation)

  const colorMapping: Record<TextImageColor, string> = {
    primary: colors['hw-primary'][600],
    secondary: colors['hw-secondary'][400],
    secondaryDark: colors['hw-secondary'][800],
    red: colors['hw-negative'][700]
  }

  const withTransparency = (color: string, transparency: string) => {
    return color.padEnd(9, transparency)
  }

  return (
    <div
      className={tx('rounded-2xl w-full', className)}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
      }}>
      <div
        className={tx(`flex flex-col px-6 py-12 rounded-2xl h-full`, contentClassName)}
        style={{
          backgroundImage: `linear-gradient(to right, ${colorMapping[color]} 30%, ${withTransparency(colorMapping[color], '55')})`
        }}
      >
        {badge && (
          <Chip variant="fullyRounded" className={tw(`!bg-white !text-[${colorMapping[color]}] mb-2 !px-4`)}>
            <Span className={tw('text-lg')}>{badge}</Span>
          </Chip>
        )}
        <div className={tw('flex flex-col gap-y-1 text-white overflow-hidden')}>
          <Span type="title" className={tw('!text-3xl')}>{title}</Span>
          <Span className={tw('text-ellipsis overflow-hidden')}>{description}</Span>
        </div>
        {onShowMoreClicked && (
          <div className={tw('flex flex-row mt-2 text-white underline')}>
            <button onClick={onShowMoreClicked}>{translation.showMore}</button>
          </div>
        )}
      </div>
    </div>
  )
}
