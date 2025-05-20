import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Inter, Space_Grotesk as SpaceGrotesk } from 'next/font/google'
import { isMobile } from 'react-device-detect'

import { ProvideLanguage } from '@helpwave/hightide'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { modalRootName } from '@helpwave/hightide'
import { ModalRegister } from '@helpwave/hightide'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/production'
import { ProvideAuth } from '@helpwave/api-services/authentication/useAuth'
import { ProvideUpdates } from '@helpwave/api-services/util/useUpdates'
import titleWrapper from '@/utils/titleWrapper'
import MobileInterceptor from '@/components/MobileInterceptor'
import '../globals.css'

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
      { /* v Scans the user agent */}
      {!isMobile ? (
        <QueryClientProvider client={queryClient}>
          <ProvideAuth>
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
          </ProvideAuth>
        </QueryClientProvider>
      ) : (<MobileInterceptor {...pageProps} />)}
    </ProvideLanguage>
  )
}

export default MyApp
