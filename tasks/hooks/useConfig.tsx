import { createConfig } from '@helpwave/common/hooks/useConfig'

export type Config = {
  api: string
}

export const { ConfigProvider, useConfig } = createConfig<Config>()
