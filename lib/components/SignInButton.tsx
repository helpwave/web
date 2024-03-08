import { noop } from '@twind/core'
import type { Languages } from '../hooks/useLanguage'
import type { PropsForTranslation } from '../hooks/useTranslation'
import { useTranslation } from '../hooks/useTranslation'
import { Helpwave } from '../icons/Helpwave'
import { tw, tx } from '../twind'

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
  onClick?: () => void
}

/**
 * The helpwave SSO sign in button coming in a light and dark mode coloring
 */
export const SignInButton = ({
  overwriteTranslation,
  color = 'light',
  onClick = noop
}: PropsForTranslation<SignInButtonTranslation, SignInButtonProps>) => {
  const translation = useTranslation(defaultSignInButtonTranslations, overwriteTranslation)
  return (
    <button
      onClick={onClick}
      className={tx('flex flex-row gap-x-1 py-3 pl-3 pr-4 rounded-2xl items-center', {
        'bg-black text-white hover:bg-gray-800': color === 'dark',
        'bg-white text-black hover:bg-gray-100': color === 'light'
      })}
    >
      <Helpwave className={tw('h-7 w-auto')}/>
      <span className={tw('text-lg font-semibold')}>{translation.signIn}</span>
    </button>
  )
}
