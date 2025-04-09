import type { Preview } from '@storybook/react'
import { type Languages, ProvideLanguage } from '../hooks/useLanguage'
import { ModalRegister } from '../components/modals/ModalRegister'
import { modalRootName } from '../components/modals/Modal'
import { ThemeProvider } from '@helpwave/style-themes/react/components/ThemeProvider'
import type { PropsForTranslation } from '../hooks/useTranslation'
import { useTranslation } from '../hooks/useTranslation'
import type { PropsWithChildren } from 'react'
import { useState } from 'react'
import { LanguageModal } from '../components/modals/LanguageModal'
import { clsx } from 'clsx'
import { SolidButton } from '../components/Button'
import '../te.css'
import { useTheme } from '@helpwave/style-themes/react/hooks/useTheme'

type HeaderTranslation = {
  languages: string,
  changeTheme: string,
}

const defaultHeaderTranslation: Record<Languages, HeaderTranslation> = {
  en: {
    languages: 'Language',
    changeTheme: 'Theme'
  },
  de: {
    languages: 'Sprache',
    changeTheme: 'Darstellung'
  }
}
const Header = ({
                                 overwriteTranslation,
                                 children
                               }: PropsForTranslation<HeaderTranslation, PropsWithChildren>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const translation = useTranslation(defaultHeaderTranslation, overwriteTranslation)
  const { theme, setTheme } = useTheme()
  return (
    <>
      <LanguageModal
        id="languageModal"
        isOpen={isOpen}
        onDone={() => setIsOpen(false)}
        onCloseClick={() => setIsOpen(false)}
        onBackgroundClick={() => setIsOpen(false)}
      />
      <div className={clsx('flex flex-row h-8 gap-x-2 w-full py-2 mb-2 justify-end items-center')}>
        <SolidButton
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          size="small"
        >
          { `${translation.changeTheme} (${theme})`}
        </SolidButton>
        <SolidButton
          onClick={() => setIsOpen(true)}
          size="small"
        >
          {translation.languages}
        </SolidButton>
      </div>
      {children}
    </>
  )
}

const preview: Preview = {
  parameters: {
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
                  <Header>
                    <App/>
                  </Header>
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
