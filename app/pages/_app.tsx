import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ProvideLanguage } from '../hooks/useLanguage'

function MyApp({ Component, pageProps }: AppProps) {
  return <ProvideLanguage><Component {...pageProps} /></ProvideLanguage>
}

export default MyApp
