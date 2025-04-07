import type { Preview } from '@storybook/react'
import { ProvideLanguage } from '../hooks/useLanguage'
import { LanguageHeader } from '../components/language/LanguageHeader'
import { ModalRegister } from '../components/modals/ModalRegister'
import { modalRootName } from '../components/modals/Modal'
import { ThemeProvider } from '@helpwave/style-themes/react/components/ThemeProvider'

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
      const App = Story
      return (
        <main>
          <ThemeProvider>
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
          </ThemeProvider>
        </main>
      )
    },
  ],
}

export default preview
