import { getConfig } from './config'
import type { LocalizedNews } from '@helpwave/common/util/news'
import { localizedNewsSchema } from '@helpwave/common/util/news'

export const fetchLocalizedNews = (): Promise<LocalizedNews> => {
  const { featuresFeedUrl } = getConfig()
  return fetch(featuresFeedUrl)
    .then((res) => res.json())
    .then(async (json) => {
      await localizedNewsSchema.parseAsync(json)
      return json
    })
}
