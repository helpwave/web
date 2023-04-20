import HelpwaveRect from '../icons/HelpwaveRect'
import type { Languages } from '../hooks/useLanguage'
import type { PropsWithLanguage } from '../hooks/useTranslation'
import { tw, tx } from '../twind'
import { useTranslation } from '../hooks/useTranslation'

type SignInButtonTranslation = {
  signIn: string
}

const defaultSignInButtonTranslations: Record<Languages, SignInButtonTranslation> = {
  en: {
    signIn: 'Sign in with helpwave'
  },
  de: {
    signIn: 'Anmelden mit helpwave'
  }
}

export type SignInButtonProps = {
  color?: 'dark' | 'light',
  onClick: () => void
}

export const SignInButton = ({
  language,
  color = 'light'
}: PropsWithLanguage<SignInButtonTranslation, SignInButtonProps>) => {
  const translation = useTranslation(language, defaultSignInButtonTranslations)
  return (
    <button
      className={tx('flex flex-row gap-x-1 py-3 pl-3 pr-4 rounded-2xl items-center', {
        'bg-black text-white hover:bg-gray-800': color === 'dark',
        'bg-white text-black hover:bg-gray-100': color === 'light'
      })}
    >
      <HelpwaveRect className={tw('h-7 w-auto')}/>
      <span className={tw('text-lg font-semibold')}>{translation.signIn}</span>
    </button>
  )
}
