import { localizedNewsSchema, type LocalizedNews } from '@helpwave/common/util/news'
import { getConfig } from './config'

export const fetchLocalizedNews = (): Promise<LocalizedNews> => {
  const { featuresFeedUrl } = getConfig()
  return fetch(featuresFeedUrl)
    .then((res) => res.json())
    .then(async (json) => {
      await localizedNewsSchema.parseAsync(json)
      return json
    })
}
