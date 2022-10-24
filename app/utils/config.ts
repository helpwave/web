import z from 'zod'

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
  NEXT_PUBLIC_API_URL: z.string(),
  NEXT_PUBLIC_MOCK: z.literal('true').or(z.literal('false')).optional(),
  NEXT_PUBLIC_REQUEST_LOGGING: z.literal('true').or(z.literal('false')).optional(),
}).transform(obj => ({
  apiUrl: obj.NEXT_PUBLIC_API_URL,
  mock: obj.NEXT_PUBLIC_MOCK === 'true',
  requestLogging: obj.NEXT_PUBLIC_REQUEST_LOGGING === 'true',
}))

const getConfig = () => {
  // use this to quickly override config values without having to change environment variables
  const localOverrides: Partial<z.output<typeof configSchema>> = {

  }

  const maybeConfig = configSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_MOCK: process.env.NEXT_PUBLIC_MOCK,
    NEXT_PUBLIC_REQUEST_LOGGING: process.env.NEXT_PUBLIC_REQUEST_LOGGING
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
