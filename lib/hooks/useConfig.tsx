import type { Context, Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useContext, useState } from 'react'

type ConfigContextValue<T = unknown> = {
  config: T,
  setConfig: Dispatch<SetStateAction<T>>
}

function createConfigContext<T>() {
  return createContext<ConfigContextValue<T> | null>(null)
}

function createUseConfig<T>(ConfigContext: Context<T | null>): () => T {
  return () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const config = useContext(ConfigContext)
    if (!config) throw new Error('useConfig() called, no config found. Call ConfigProvider() first.')
    return config
  }
}

function createConfigProvider<T>(ConfigContext: Context<ConfigContextValue<T> | null>) {
  // eslint-disable-next-line react/display-name
  return ({ children, initialConfig }: PropsWithChildren<{ initialConfig: T }>) => {
    const [config, setConfig] = useState(initialConfig)

    return (
      <ConfigContext.Provider value={{ config, setConfig }}>
        {children}
      </ConfigContext.Provider>
    )
  }
}

export function createConfig<T extends Record<string, unknown>>() {
  const ConfigContext = createConfigContext<T>()
  const useConfig = createUseConfig(ConfigContext)
  const ConfigProvider = createConfigProvider(ConfigContext)
  return { ConfigContext, ConfigProvider, useConfig }
}
