import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Inter, Space_Grotesk as SpaceGrotesk } from '@next/font/google'
import { tw } from '@helpwave/common/twind/index'
import { ProvideLanguage } from '@helpwave/common/hooks/useLanguage'
import withNextApp from '@helpwave/common/twind/next/app'
import { config } from '@helpwave/common/twind/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserView, MobileView } from 'react-device-detect'
import MobileInterceptor from '../components/MobileInterceptor'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

const spaceGrotesk = SpaceGrotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ProvideLanguage>
      <BrowserView>
        <Head>
          <title>helpwave tasks</title>
          <style>{`
          :root {
            --font-inter: ${inter.style.fontFamily};
            --font-space: ${spaceGrotesk.style.fontFamily};
          }
        `}</style>
        </Head>
        <QueryClientProvider client={queryClient}>
          <div className={tw('font-sans')}>
            <Component {...pageProps} />
          </div>
        </QueryClientProvider>
      </BrowserView>
      <MobileView>
        <MobileInterceptor {...pageProps} />
      </MobileView>
    </ProvideLanguage>
  )
}

export default withNextApp(config, MyApp)
