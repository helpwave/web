import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { Inter, Space_Grotesk as SpaceGrotesk } from '@next/font/google'
import { tw } from '@twind/core'
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
        <title>helpwave</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=1" />
        <style>{`
          :root {
            --font-inter: ${inter.style.fontFamily};
            --font-space: ${spaceGrotesk.style.fontFamily};
          }
        `}</style>
      </Head>
      <div className={tw('font-sans')}>
        <Component {...pageProps} />
        <Toaster />
      </div>
    </>
  )
}

export default withNextApp(config, MyApp)
