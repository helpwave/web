import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Inter, Space_Grotesk as SpaceGrotesk } from 'next/font/google'
import { isMobile } from 'react-device-detect'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ModalRegister, modalRootName, ProvideLanguage, ThemeProvider } from '@helpwave/hightide'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/production'
import { ProvideAuth } from '@helpwave/api-services/authentication/useAuth'
import { ProvideUpdates } from '@helpwave/api-services/util/useUpdates'
import titleWrapper from '@/utils/titleWrapper'
import MobileInterceptor from '@/components/MobileInterceptor'
import '../globals.css'
import { InitializationChecker } from '@/components/layout/InitializationChecker'

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
  return (
    <ProvideLanguage>
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

                  <ModalRegister>
                    <div className="font-sans" id={modalRootName}>
                      <Component {...pageProps} />
                    </div>
                  </ModalRegister>
                  <ReactQueryDevtools position="bottom-left"/>
                </ProvideUpdates>
              </InitializationChecker>
            </ProvideAuth>
          </QueryClientProvider>
        ) : (<MobileInterceptor {...pageProps} />)}
      </ThemeProvider>
    </ProvideLanguage>
  )
}

export default MyApp
