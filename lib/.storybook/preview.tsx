import { Preview } from '@storybook/react'
import withNextApp from '../twind/next/app'
import config from '../twind/config'
import { Inter, Space_Grotesk } from 'next/font/google'
import { ProvideLanguage } from '../hooks/useLanguage'
import { LanguageHeader } from '../components/language/LanguageHeader'
import { ModalRegister } from '../components/modals/ModalRegister'
import { modalRootName } from '../components/modals/Modal'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => {
      const App = withNextApp(config, Story)
      return (
        <main>
          <style>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-space: ${spaceGrotesk.style.fontFamily};
        }
      `}</style>
          <ProvideLanguage>
            <ModalRegister>
              <div id={modalRootName}>
                {/* TODO try to integrate this header/language select directly into the storybook interface */}
                <LanguageHeader>
                  <App/>
                </LanguageHeader>
              </div>
            </ModalRegister>
          </ProvideLanguage>
        </main>
      )
    },
  ],
}

export default preview
