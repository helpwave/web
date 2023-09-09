import { ProvideLanguage } from '@helpwave/common/hooks/useLanguage'
import { tw } from '@helpwave/common/twind'
import { config } from '@helpwave/common/twind/config'
import withNextApp from '@helpwave/common/twind/next/app'
import type { AppProps } from 'next/app'
import { Inter, Space_Grotesk as SpaceGrotesk } from 'next/font/google'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

const spaceGrotesk = SpaceGrotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>helpwave</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=1" />
        <style>{`
          :root {
            --font-inter: ${inter.style.fontFamily};
            --font-space: ${spaceGrotesk.style.fontFamily};
          }
        `}</style>
      </Head>
      <ProvideLanguage>
        <div className={tw('font-sans')}>
          <Component {...pageProps} />
          <Toaster />
        </div>
      </ProvideLanguage>
    </>
  )
}

export default withNextApp(config, MyApp)
