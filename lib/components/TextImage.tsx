import { tw, tx } from '@helpwave/style-themes/twind'
import type { Languages } from '../hooks/useLanguage'
import type { PropsForTranslation } from '../hooks/useTranslation'
import { useTranslation } from '../hooks/useTranslation'
import { Chip } from './ChipList'
import type { TextImageColor } from '@helpwave/style-themes/twind/theme-variables'
import { ThemeVariables } from '@helpwave/style-themes/twind/theme-variables'


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
    primary: ThemeVariables.themes.light['text-image-primary-background']!,
    secondary: ThemeVariables.themes.light['text-image-secondary-background']!,
    dark: ThemeVariables.themes.light['text-image-dark-background']!,
  }

  const withTransparency = (color: string, transparency: string) => {
    return color.slice(0, 7) + transparency
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
          <Chip variant="fullyRounded" className={tw(`bg-white text-image-${color}-text mb-2 !px-4`)}>
            <span className={tw(`text-lg text-text-image-${color}-background`)}>{badge}</span>
          </Chip>
        )}
        <div className={tw('flex flex-col gap-y-1 text-white overflow-hidden')}>
          <span className={tw('textstyle-title-xl')}>{title}</span>
          <span className={tw('text-ellipsis overflow-hidden')}>{description}</span>
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
