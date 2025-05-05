import { ProvideLanguage } from '@helpwave/common/hooks/useLanguage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { usePathname } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import { ModalRegister } from '@helpwave/common/components/modals/ModalRegister'
import { modalRootName } from '@helpwave/common/components/modals/Modal'
import '../globals.css'
import { Inter, Space_Grotesk } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const spaceGrotesk = Space_Grotesk({
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
        <ProvideLanguage initialLanguage={defaultLanguage}>
          <ModalRegister>
            <div className="font-sans" id={modalRootName}>
              <Component {...pageProps} />
              <Toaster/>
            </div>
          </ModalRegister>
        </ProvideLanguage>
      </QueryClientProvider>
    </>
  )
}

export default MyApp
