import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Inter, Space_Grotesk as SpaceGrotesk } from 'next/font/google'
import { ProvideLanguage } from '@helpwave/hightide'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { modalRootName } from '@helpwave/hightide'
import { ModalRegister } from '@helpwave/hightide'
import titleWrapper from '@/utils/titleWrapper'
import '@helpwave/hightide/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = SpaceGrotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ProvideLanguage>
      { /* v Scans the user agent */}
      <Head>
        <title>{titleWrapper()}</title>
        <style>{`
            :root {
              --font-inter: ${inter.style.fontFamily};
              --font-space: ${spaceGrotesk.style.fontFamily};
            }
            dialog::backdrop {
              background-color: rgba(0, 0, 0, 0.7);
            }
            `}</style>
      </Head>
      <QueryClientProvider client={queryClient}>
        <ModalRegister>
          <div className="font-sans" id={modalRootName}>
            <Component {...pageProps} />
          </div>
        </ModalRegister>
      </QueryClientProvider>
    </ProvideLanguage>
  )
}

export default MyApp
