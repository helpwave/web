import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Inter, Space_Grotesk as SpaceGrotesk } from 'next/font/google'
import { isMobile } from 'react-device-detect'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LanguageProvider, ThemeProvider } from '@helpwave/hightide'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/production'
import { ProvideAuth } from '@helpwave/api-services/authentication/useAuth'
import { ProvideUpdates } from '@helpwave/api-services/util/useUpdates'
import titleWrapper from '@/utils/titleWrapper'
import MobileInterceptor from '@/components/MobileInterceptor'
import '../globals.css'
import { InitializationChecker } from '@/components/layout/InitializationChecker'
import { getConfig } from '@/utils/config'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

const spaceGrotesk = SpaceGrotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

const queryClient = new QueryClient()

function MyApp({
                 Component,
                 pageProps
               }: AppProps) {
  const config = getConfig()
  return (
    <LanguageProvider>
      <ThemeProvider>
        { /* v Scans the user agent */}
        {!isMobile ? (
          <QueryClientProvider client={queryClient}>
            <ProvideAuth>
              <InitializationChecker>
                <ProvideUpdates>
                  <Head>
                    <title>{titleWrapper()}</title>
                    <style>{`
            :root {
              --font-inter: ${inter.style.fontFamily};
              --font-space: ${spaceGrotesk.style.fontFamily};
            }
            `}</style>
                  </Head>
                  <Component {...pageProps} />
                  {config.env === 'development' && <ReactQueryDevtools position="bottom-left"/>}
                </ProvideUpdates>
              </InitializationChecker>
            </ProvideAuth>
          </QueryClientProvider>
        ) : (<MobileInterceptor {...pageProps} />)}
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default MyApp
