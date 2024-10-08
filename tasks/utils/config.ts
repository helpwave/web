import { z } from 'zod'

/*
  Config loading works by having a zod schema which validates the environment variables.
  On the server side all environment variables are available all the time, on the client however
  only the ones prefixed with "NEXT_PUBLIC" (and the special `ENV` variable) are available.
  These are baked-in at compile time and must be explicitely written out like follows:
  `process.env.NEXT_PUBLIC_XXX`

  This means that when using a centralized config file with (zod) type checking, we need to
  mention variables multiple times by their full name. This is a bit annoying, but there is
  no way around this.

  It is also important to note that next will execute all (non-api) pages at build time to
  gather all the data needed for the static site generation (getStaticProps). This means that
  all top level code is also executed and thus all environment variables are read.
  For this reason the environment variables should be in place at build time, otherwise the config
  parsing will fail.

  If the environment variables aren't configured correctly an error will be thrown detailing
  what is wrong.
  An example .env file is provided, create a custom one called `.env.local` from that. This file
  can however be out of date at some point, so it is recommended to check the config schema
  for the latest variables.
*/

const configSchema = z.object({
  NODE_ENV: z.literal('production').or(z.literal('development')).default('production'),
  NEXT_PUBLIC_SHOW_STAGING_DISCLAIMER_MODAL: z.literal('true').or(z.literal('false')).optional(),
  NEXT_PUBLIC_PLAYSTORE_LINK: z.string().url().default('https://play.google.com/store/apps'),
  NEXT_PUBLIC_APPSTORE_LINK: z.string().url().default('https://www.apple.com/de/app-store/'),
  NEXT_PUBLIC_FEEDBACK_FORM_URL: z.string().url().default('https://share-eu1.hsforms.com/1Libxb_ANSm-CpMCQ37Ti6Qfsrtd'),
  NEXT_PUBLIC_FEATURES_FEED_URL: z.string().url().default('https://cdn.helpwave.de/feed.json'),
  NEXT_PUBLIC_IMPRINT_URL: z.string().url().default('https://cdn.helpwave.de/imprint.html'),
  NEXT_PUBLIC_PRIVACY_URL: z.string().url().default('https://cdn.helpwave.de/privacy.html'),
}).transform(obj => ({
  env: obj.NODE_ENV,
  showStagingDisclaimerModal: obj.NEXT_PUBLIC_SHOW_STAGING_DISCLAIMER_MODAL === 'true',
  appstoreLinks: {
    playStore: obj.NEXT_PUBLIC_PLAYSTORE_LINK,
    appStore: obj.NEXT_PUBLIC_APPSTORE_LINK
  },
  feedbackFormUrl: obj.NEXT_PUBLIC_FEEDBACK_FORM_URL,
  featuresFeedUrl: obj.NEXT_PUBLIC_FEATURES_FEED_URL,
  imprintUrl: obj.NEXT_PUBLIC_IMPRINT_URL,
  privacyUrl: obj.NEXT_PUBLIC_PRIVACY_URL,
}))

const getConfig = () => {
  // use this to quickly override config values without having to change environment variables
  const localOverrides: Partial<z.output<typeof configSchema>> = {

  }

  const maybeConfig = configSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SHOW_STAGING_DISCLAIMER_MODAL: process.env.NEXT_PUBLIC_SHOW_STAGING_DISCLAIMER_MODAL,
    NEXT_PUBLIC_PLAYSTORE_LINK: process.env.NEXT_PUBLIC_PLAYSTORE_LINK,
    NEXT_PUBLIC_APPSTORE_LINK: process.env.NEXT_PUBLIC_APPSTORE_LINK,
    NEXT_PUBLIC_FEEDBACK_FORM_URL: process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL,
    NEXT_PUBLIC_FEATURES_FEED_URL: process.env.NEXT_PUBLIC_FEATURES_FEED_URL,
    NEXT_PUBLIC_IMPRINT_URL: process.env.NEXT_PUBLIC_IMPRINT_URL,
    NEXT_PUBLIC_PRIVACY_URL: process.env.NEXT_PUBLIC_PRIVACY_URL
  })

  if (!maybeConfig.success) {
    throw new Error(`Invalid environment variables:\n${maybeConfig.error}`)
  } else {
    return Object.assign(maybeConfig.data, localOverrides)
  }
}

export {
  getConfig
}
