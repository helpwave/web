
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useLanguage } from '@helpwave/common/hooks/useLanguage'
import { filterNews, type LocalizedNews } from '@helpwave/common/util/news'
import { NewsDisplay } from '../NewsDisplay'
import { ColumnTitle } from '../ColumnTitle'

type NewsFeedTranslation = {
  title: string,
  noNews: string,
}

const defaultNewsFeedTranslations: Record<Languages, NewsFeedTranslation> = {
  en: {
    title: 'What\'s new in helpwave tasks?',
    noNews: 'No News in your language found'
  },
  de: {
    title: 'Was ist neu in helpwave tasks?',
    noNews: 'Keine Neuheiten in deiner Sprache gefunden'
  }
}

export type NewsFeedProps = {
  localizedNews: LocalizedNews,
  width?: number,
}

/**
 * The right side of the dashboard page
 */
export const NewsFeed = ({
  overwriteTranslation,
  localizedNews,
  width
}: PropsForTranslation<NewsFeedTranslation, NewsFeedProps>) => {
  const translation = useTranslation(defaultNewsFeedTranslations, overwriteTranslation)
  // The value of how much space a FeatureDisplay needs before the title can be displayed on its left
  // Given in px
  const widthForAppearanceChange = 600
  let usedLanguage = useLanguage().language
  usedLanguage = overwriteTranslation?.language ?? usedLanguage
  const newsFilter = 'tasks'
  return (
    <div className="col py-4 px-6 gap-y-4">
      <ColumnTitle title={translation.title}/>
      {usedLanguage ? filterNews(localizedNews[usedLanguage], [newsFilter]).map(news => (
        <NewsDisplay
          key={news.title}
          news={news}
          titleOnTop={width ? width < widthForAppearanceChange : undefined}
        />
      )) : (
        <div className="col items-center justify-center w-full h-20">
          {translation.noNews}
        </div>
      )}
    </div>
  )
}
