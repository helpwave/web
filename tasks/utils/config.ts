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
  NEXT_PUBLIC_API_URL: z.string().url().default('https://api.helpwave.de'),
  NEXT_PUBLIC_MOCK: z.literal('true').or(z.literal('false')).optional(),
  NEXT_PUBLIC_REQUEST_LOGGING: z.literal('true').or(z.literal('false')).optional(),
  NEXT_PUBLIC_PLAYSTORE_LINK: z.string().url().default('https://play.google.com/store/apps'),
  NEXT_PUBLIC_APPSTORE_LINK: z.string().url().default('https://www.apple.com/de/app-store/'),
  NEXT_PUBLIC_OAUTH_ISSUER_URL: z.string().url().default('https://auth.helpwave.de'),
  NEXT_PUBLIC_OAUTH_REDIRECT_URI: z.string().url().default('https://tasks.helpwave.de/auth/callback'),
  NEXT_PUBLIC_OAUTH_CLIENT_ID: z.string().default('425f8b8d-c786-4ff7-b2bf-e52f505fb588'),
  NEXT_PUBLIC_OAUTH_SCOPES: z.string().default('openid,offline_access,email,nickname,name,organizations'),
  NEXT_PUBLIC_FAKE_TOKEN_ENABLE: z.literal('true').or(z.literal('false')).default('false'),
  NEXT_PUBLIC_FAKE_TOKEN: z.object({ sub: z.string().uuid(), name: z.string(), nickname: z.string(), email: z.string().email(), organizations: z.string().array() }).default({ sub: '18159713-5d4e-4ad5-94ad-fbb6bb147984', name: 'Max Mustermann', nickname: 'max.mustermann', email: 'max.mustermann@helpwave.de', organizations: ['3b25c6f5-4705-4074-9fc6-a50c28eba406'] }),
  NEXT_PUBLIC_FEEDBACK_FORM_URL: z.string().url().default('https://share-eu1.hsforms.com/1Libxb_ANSm-CpMCQ37Ti6Qfsrtd'),
  NEXT_PUBLIC_FEATURES_FEED_URL: z.string().url().default('https://cdn.helpwave.de/feed.json'),
  NEXT_PUBLIC_REACT_QUERY_REFETCH_TIME: z.number().default(5000),
}).transform(obj => ({
  env: obj.NODE_ENV,
  apiUrl: obj.NEXT_PUBLIC_API_URL,
  mock: obj.NEXT_PUBLIC_MOCK === 'true',
  requestLogging: obj.NEXT_PUBLIC_REQUEST_LOGGING === 'true',
  appstoreLinks: {
    playStore: obj.NEXT_PUBLIC_PLAYSTORE_LINK,
    appStore: obj.NEXT_PUBLIC_APPSTORE_LINK
  },
  oauth: {
    issuerUrl: obj.NEXT_PUBLIC_OAUTH_ISSUER_URL,
    redirectUri: obj.NEXT_PUBLIC_OAUTH_REDIRECT_URI,
    clientId: obj.NEXT_PUBLIC_OAUTH_CLIENT_ID,
    scopes: obj.NEXT_PUBLIC_OAUTH_SCOPES.split(',').map((scope) => scope.trim())
  },
  fakeTokenEnable: obj.NEXT_PUBLIC_FAKE_TOKEN_ENABLE === 'true',
  fakeToken: Buffer.from(JSON.stringify(obj.NEXT_PUBLIC_FAKE_TOKEN)).toString('base64'),
  feedbackFormUrl: obj.NEXT_PUBLIC_FEEDBACK_FORM_URL,
  featuresFeedUrl: obj.NEXT_PUBLIC_FEATURES_FEED_URL,
  queryRefetchTime: obj.NEXT_PUBLIC_REACT_QUERY_REFETCH_TIME,
}))

const getConfig = () => {
  // use this to quickly override config values without having to change environment variables
  const localOverrides: Partial<z.output<typeof configSchema>> = {

  }

  const maybeConfig = configSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_MOCK: process.env.NEXT_PUBLIC_MOCK,
    NEXT_PUBLIC_REQUEST_LOGGING: process.env.NEXT_PUBLIC_REQUEST_LOGGING,
    NEXT_PUBLIC_PLAYSTORE_LINK: process.env.NEXT_PUBLIC_PLAYSTORE_LINK,
    NEXT_PUBLIC_APPSTORE_LINK: process.env.NEXT_PUBLIC_APPSTORE_LINK,
    NEXT_PUBLIC_OAUTH_ISSUER_URL: process.env.NEXT_PUBLIC_OAUTH_ISSUER_URL,
    NEXT_PUBLIC_OAUTH_REDIRECT_URI: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI,
    NEXT_PUBLIC_OAUTH_CLIENT_ID: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID,
    NEXT_PUBLIC_OAUTH_SCOPES: process.env.NEXT_PUBLIC_OAUTH_SCOPES,
    NEXT_PUBLIC_FAKE_TOKEN_ENABLE: process.env.NEXT_PUBLIC_FAKE_TOKEN_ENABLE,
    NEXT_PUBLIC_FAKE_TOKEN: process.env.NEXT_PUBLIC_FAKE_TOKEN,
    NEXT_PUBLIC_REACT_QUERY_REFETCH_TIME: process.env.NEXT_PUBLIC_REACT_QUERY_REFETCH_TIME
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
