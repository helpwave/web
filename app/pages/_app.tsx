import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Inter, Space_Grotesk as SpaceGrotesk } from '@next/font/google'
import { tw } from '@twind/core'
import { ProvideLanguage } from '../hooks/useLanguage'
import withNextApp from '../twind/next/app'
import { config } from '../twind.config'

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
        </div>
      </ProvideLanguage>
    </>
  )
}

export default withNextApp(config, MyApp)
