import type { Languages } from '../hooks/useLanguage'
import type { PropsForTranslation } from '../hooks/useTranslation'
import { useTranslation } from '../hooks/useTranslation'
import clsx from 'clsx'

type TextImageColor = 'primary' | 'secondary' | 'dark'

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

  const chipColorMapping: Record<TextImageColor, string> = {
    primary: 'text-text-image-primary-background bg-text-text-image-primary-text',
    secondary: 'text-text-image-secondary-background bg-text-text-image-secondary-text',
    dark: 'text-text-image-dark-background bg-text-text-image-dark-text',
  }

  const colorMapping: Record<TextImageColor, string> = {
    primary: 'text-text-image-primary-text bg-linear-to-r from-30% from-text-image-primary-background to-text-image-primary-background/55',
    secondary: 'text-text-image-secondary-text bg-linear-to-r from-30% from-text-image-secondary-background to-text-image-secondary-background/55',
    dark: 'text-text-image-dark-text bg-linear-to-r from-30% from-text-image-dark-background to-text-image-dark-background/55',
  }

  return (
    <div
      className={clsx('rounded-2xl w-full', className)}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
      }}>
      <div
        className={clsx(`col px-6 py-12 rounded-2xl h-full`, colorMapping[color], contentClassName)}>
        {badge && (
          <div className={clsx(`chip-full bg-white mb-2 py-2 px-4 w-fit`, chipColorMapping[color])}>
            <span className="text-lg font-bold">{badge}</span>
          </div>
        )}
        <div className="col gap-y-1 text-white overflow-hidden">
          <span className="textstyle-title-xl">{title}</span>
          <span className="text-ellipsis overflow-hidden">{description}</span>
        </div>
        {onShowMoreClicked && (
          <div className="row mt-2 text-white underline">
            <button onClick={onShowMoreClicked}>{translation.showMore}</button>
          </div>
        )}
      </div>
    </div>
  )
}
