import { z } from 'zod'
import type { Languages } from '../hooks/useLanguage'
import { languages } from '../hooks/useLanguage'

export type News = {
  title: string,
  date: Date,
  description: (string | URL)[],
  externalResource?: URL,
  keys: string[],
}

export type LocalizedNews = Record<Languages, News[]>

export const newsSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  image: z.string().url().optional(),
  externalResource: z.string().url().optional(),
  keys: z.array(z.string())
}).transform<News>((obj) => {
  let description: (string | URL)[] = [obj.description]
  if (obj.image) {
    description = [new URL(obj.image), ...description]
  }

  return {
    title: obj.title,
    date: new Date(obj.date),
    description,
    externalResource: obj.externalResource ? new URL(obj.externalResource) : undefined,
    keys: obj.keys
  }
})

export const newsListSchema = z.array(newsSchema)

export const localizedNewsSchema = z.record(z.enum(languages), newsListSchema)

export const filterNews = (localizedNews: News[], requiredKeys: string[]) => {
  return localizedNews.filter(news => requiredKeys.every(value => news.keys.includes(value)))
}
