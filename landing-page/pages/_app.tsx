import { ProvideLanguage } from '@helpwave/common/hooks/useLanguage'
import { tw } from '@helpwave/color-themes/twind'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { Inter, Space_Grotesk as SpaceGrotesk } from 'next/font/google'
import Head from 'next/head'
import { usePathname } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import { ModalRegister } from '@helpwave/common/components/modals/ModalRegister'
import { modalRootName } from '@helpwave/common/components/modals/Modal'
import withNextApp from '@helpwave/color-themes/twind/next/app'
import config from '@helpwave/color-themes/twind/config'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const spaceGrotesk = SpaceGrotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient()
  const pathname = usePathname()

  // All mediQuu customers are from germany, therefore /mediquu overrides the defaultLanguage
  const defaultLanguage = pathname === '/mediquu' ? 'de' : undefined

  return (
    <>
      <Head>
        <title>helpwave</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=1"/>
        <style>{`
          :root {
            --font-inter: ${inter.style.fontFamily};
            --font-space: ${spaceGrotesk.style.fontFamily};
          }
        `}</style>
      </Head>
      <QueryClientProvider client={queryClient}>
        <ProvideLanguage defaultLanguage={defaultLanguage}>
          <ModalRegister>
            <div className={tw('font-sans')} id={modalRootName}>
              <Component {...pageProps} />
              <Toaster/>
            </div>
          </ModalRegister>
        </ProvideLanguage>
      </QueryClientProvider>
    </>
  )
}

export default withNextApp(config, MyApp)
