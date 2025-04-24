import type { Preview } from '@storybook/react'
import { ProvideLanguage } from '../hooks/useLanguage'
import { ModalRegister } from '../components/modals/ModalRegister'
import { modalRootName } from '../components/modals/Modal'
import { ThemeProvider } from '@helpwave/style-themes/react/components/ThemeProvider'
import '../te.css'

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
    language: {
      name: 'Language',
      description: 'Component Language',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'de', title: 'German' },
        ],
      },
    },
  },

  decorators: [
    (Story, context) => {
      const App = Story
      const theme = context.globals.theme
      const language = context.globals.language

      return (
        <main data-theme={theme}>
          <ThemeProvider initialTheme={theme}>
            <ProvideLanguage initialLanguage={language}>
              <ModalRegister>
                <div id={modalRootName}>
                  <App />
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
