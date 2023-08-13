import Head from 'next/head'
import type { AppContext, AppInitialProps, AppProps } from 'next/app'
import App from 'next/app'
import { Inter, Space_Grotesk as SpaceGrotesk } from 'next/font/google'
import { tw } from '@helpwave/common/twind'
import { ProvideLanguage } from '@helpwave/common/hooks/useLanguage'
import withNextApp from '@helpwave/common/twind/next/app'
import { config } from '@helpwave/common/twind/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MobileInterceptor from '../components/MobileInterceptor'
import titleWrapper from '../utils/titleWrapper'
import type { Config } from '../hooks/useConfig'
import { ConfigProvider, parseConfigFromEnvironmentVariablesWithNextPublicPrefix } from '../hooks/useConfig'
import { useEffect } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

const spaceGrotesk = SpaceGrotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

const queryClient = new QueryClient()

type AppOwnProps = { config: Config }

function MyApp({ Component, pageProps, config }: AppProps & AppOwnProps) {
  return (
    <ConfigProvider initialConfig={config}>
      <ProvideLanguage>
        <div className={tw('mobile:hidden')}>
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

        <div className={tw('desktop:hidden')}>
          <MobileInterceptor {...pageProps} />
        </div>
      </ProvideLanguage>
    </ConfigProvider>
  )
}

// TODO: Adopting the AppRouter https://nextjs.org/docs/pages/building-your-application/routing/custom-app#getinitialprops-with-app
MyApp.getInitialProps = async (context: AppContext): Promise<AppInitialProps & AppOwnProps> => {
  const ctx = await App.getInitialProps(context)
  const config = parseConfigFromEnvironmentVariablesWithNextPublicPrefix()
  return { ...ctx, config }
}

export default withNextApp(config, MyApp)
