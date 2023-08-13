import z from 'zod'
import { createConfig } from '@helpwave/common/hooks/useConfig'

const fakeTokenSchema = z.object({
  sub: z.string().uuid(),
  name: z.string(),
  nickname: z.string(),
  email: z.string().email(),
  organizations: z.string().array()
}).default({
  sub: '18159713-5d4e-4ad5-94ad-fbb6bb147984',
  name: 'Max Mustermann',
  nickname: 'max.mustermann',
  email: 'max.mustermann@helpwave.de',
  organizations: [
    '3b25c6f5-4705-4074-9fc6-a50c28eba406'
  ]
})

export const configSchema = z.object({
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
  NEXT_PUBLIC_FAKE_TOKEN: fakeTokenSchema,
}).transform((obj) => ({
  apiUrl: obj.NEXT_PUBLIC_API_URL,
  mock: obj.NEXT_PUBLIC_MOCK,
  requestLogging: obj.NEXT_PUBLIC_REQUEST_LOGGING === 'true',
  appstoreLinks: {
    playStore: obj.NEXT_PUBLIC_PLAYSTORE_LINK,
    appStore: obj.NEXT_PUBLIC_APPSTORE_LINK,
  },
  oauth: {
    issuerUrl: obj.NEXT_PUBLIC_OAUTH_ISSUER_URL,
    redirectUri: obj.NEXT_PUBLIC_OAUTH_REDIRECT_URI,
    clientId: obj.NEXT_PUBLIC_OAUTH_CLIENT_ID,
    scopes: obj.NEXT_PUBLIC_OAUTH_SCOPES.split(',').map((scope) => scope.trim())
  },
  fakeTokenEnable: obj.NEXT_PUBLIC_FAKE_TOKEN_ENABLE === 'true',
  fakeToken: Buffer.from(JSON.stringify(obj.NEXT_PUBLIC_FAKE_TOKEN)).toString('base64'),
}))

export const parseConfigFromEnvironmentVariablesWithNextPublicPrefix = () => {
  // Filter environment variables that starts with "NEXT_PUBLIC_"
  const possibleEnvironmentVariables = Object.keys(process.env).reduce<Record<string, string|undefined>>((acc, key) => {
    if (key.startsWith('NEXT_PUBLIC_')) {
      acc[key] = process.env[key]
    }
    return acc
  }, {})

  const config = configSchema.safeParse(possibleEnvironmentVariables)
  if (!config.success) throw new Error(`Invalid environment variables:\n${config.error}`)
  return config.data
}

export type Config = z.output<typeof configSchema>

export const { ConfigProvider, useConfig } = createConfig<Config>()
