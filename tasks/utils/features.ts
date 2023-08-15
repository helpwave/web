import { z } from 'zod'
import { getConfig } from './config';

export type Feature = {
  title: string,
  date: Date,
  description: (string | URL)[],
  externalResource?: URL
}

export const featureSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  image: z.string().url().optional(),
  externalResource: z.string().url().optional(),
}).transform<Feature>((obj) => {
  let description: (string | URL)[] = [obj.description]
  if (obj.image) description = [new URL(obj.image), ...description]

  return {
    title: obj.title,
    date: new Date(obj.date),
    description,
    externalResource: obj.externalResource ? new URL(obj.externalResource) : undefined
  }
})

export const featuresSchema = z.array(featureSchema)

export const fetchFeatures = (): Promise<Feature[]> => {
  const { featuresFeedUrl } = getConfig()
  return fetch(featuresFeedUrl)
    .then((res) => res.json())
    .then(async (json) => {
      await featuresSchema.parseAsync(json)
      return json as Feature[]
    })
}
