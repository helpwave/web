import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Inter, Space_Grotesk as SpaceGrotesk } from 'next/font/google'
import { isMobile } from 'react-device-detect'
import { tw } from '@helpwave/common/twind'
import { ProvideLanguage } from '@helpwave/common/hooks/useLanguage'
import withNextApp from '@helpwave/common/twind/next/app'
import { config } from '@helpwave/common/twind/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { modalRootName } from '@helpwave/common/components/modals/Modal'
import { ModalRegister } from '@helpwave/common/components/modals/ModalRegister'
import titleWrapper from '@/utils/titleWrapper'
import MobileInterceptor from '@/components/MobileInterceptor'

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
        <>
          <Head>
            <title>{titleWrapper()}</title>
            <style>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-space: ${spaceGrotesk.style.fontFamily};
        }
      `}</style>
          </Head>
          <QueryClientProvider client={queryClient}>
            <ModalRegister>
              <div className={tw('font-sans')} id={modalRootName}>
                <Component {...pageProps} />
              </div>
            </ModalRegister>
          </QueryClientProvider>
        </>
      ) : (<MobileInterceptor {...pageProps} />)}
    </ProvideLanguage>
  )
}

export default withNextApp(config, MyApp)
