import type { Preview } from '@storybook/react'
import { ProvideLanguage } from '../hooks/useLanguage'
import { ModalRegister } from '../components/modals/ModalRegister'
import { modalRootName } from '../components/modals/Modal'
import '../globals.css'
import type { ThemeType } from '../hooks/useTheme'
import { ThemeProvider } from '../hooks/useTheme'

const colorToHex: Record<ThemeType, string> = {
  dark: '#1A1A1A',
  light: '#EEE',
}

const colorToHexReverse: Record<string, ThemeType> = {
  '#1A1A1A': 'dark',
  '#EEE': 'light',
  'transparent': 'light',
}

const preview: Preview = {
  parameters: {
    backgrounds: {
      values: [
        { name: 'Dark', value: colorToHex.dark },
        { name: 'Light', value: colorToHex.light },
      ],
      default: 'Light',
    },
  },
  globalTypes: {
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
      const theme = colorToHexReverse[context.globals.backgrounds?.value ?? colorToHex.light]
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
