import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { getAuthorizationUrl } from '../utils/oauth'
import { Button } from './Button'

type SignInButtonTranslation = {
  signInWithHelpwave: string
}

const defaultSignInButtonTranslation: Record<Languages, SignInButtonTranslation> = {
  en: {
    signInWithHelpwave: 'Sign in with helpwave',
  },
  de: {
    signInWithHelpwave: 'Anmelden mit helpwave',
  },
}

const SignInButton = ({
  language,
}: PropsWithLanguage<SignInButtonTranslation>) => {
  const translation = useTranslation(language, defaultSignInButtonTranslation)

  return (
    <Button variant="secondary" onClick={() => {
      getAuthorizationUrl().then((url) => window.location.assign(url))
    }}>{translation.signInWithHelpwave}</Button>
  )
}

export default SignInButton
