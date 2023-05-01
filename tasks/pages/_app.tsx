import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Inter, Space_Grotesk as SpaceGrotesk } from '@next/font/google'
import { css, tw } from '@helpwave/common/twind'
import { ProvideLanguage } from '@helpwave/common/hooks/useLanguage'
import withNextApp from '@helpwave/common/twind/next/app'
import { config } from '@helpwave/common/twind/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MobileInterceptor from '../components/MobileInterceptor'
import titleWrapper from '../utils/titleWrapper'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

const spaceGrotesk = SpaceGrotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

const queryClient = new QueryClient()

const globalStyles = css`
  @media (max-width: 1350px) {
    .desktop-wrapper{
      display: none;
    }
  }

  @media (min-width: 1350px) {
    .mobile-wrapper{
      display: none;
    }
  }
`

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={tw(globalStyles)}>
      <ProvideLanguage>
        <div className="desktop-wrapper">
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
            <div className={tw('font-sans')} id="modal-root">
              <Component {...pageProps} />
            </div>
          </QueryClientProvider>
        </div>
        <div className="mobile-wrapper">
          <MobileInterceptor {...pageProps} />
        </div>S
      </ProvideLanguage>
    </div>
  )
}

export default withNextApp(config, MyApp)
