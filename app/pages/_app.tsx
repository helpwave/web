import type { AppProps } from 'next/app'
import { ProvideLanguage } from '../hooks/useLanguage'
import withNextApp from '../twind/next/app'
import { config } from '../twind/config'

function MyApp({ Component, pageProps }: AppProps) {
  return <ProvideLanguage><Component {...pageProps} /></ProvideLanguage>
}

export default withNextApp(config, MyApp)
