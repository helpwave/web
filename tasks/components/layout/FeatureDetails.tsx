import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { ColumnTitle } from '../ColumnTitle'
import type { Feature } from '../FeatureDisplay'
import { FeatureDisplay } from '../FeatureDisplay'

type FeatureDetailsTranslation = {
  title: string
}

const defaultFeatureDetailsTranslations: Record<Languages, FeatureDetailsTranslation> = {
  en: {
    title: 'What\'s new in helpwave tasks?'
  },
  de: {
    title: 'Was ist neu in helpwave tasks?'
  }
}

export type FeatureDetailsProps = {
  features: Feature[],
  width?: number
}

/**
 * The right side of the dashboard page
 */
export const FeatureDetails = ({
  language,
  features,
  width
}: PropsWithLanguage<FeatureDetailsTranslation, FeatureDetailsProps>) => {
  const translation = useTranslation(language, defaultFeatureDetailsTranslations)
  return (
    <div className={tw('flex flex-col py-4 px-6 gap-y-4')}>
      <ColumnTitle title={translation.title}/>
      {features.map(feature => (
        <FeatureDisplay
          key={feature.title}
          feature={feature}
          titleOnTop={width !== undefined ? width < 600 : undefined}
        />
      ))}
    </div>
  )
}
