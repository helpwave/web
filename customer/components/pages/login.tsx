import type { Languages } from '@helpwave/hightide/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { SolidButton } from '@helpwave/hightide/components/Button'

type LoginTranslation = {
  login: string,
  email: string,
  password: string,
  signIn: string,
  register: string,
}

const defaultLoginTranslations: Record<Languages, LoginTranslation> = {
  en: {
    login: 'Login',
    email: 'Email',
    password: 'Password',
    signIn: 'helpwave Sign In',
    register: 'Register',
  },
  de: {
    login: 'Login',
    email: 'Email',
    password: 'Passwort',
    signIn: 'helpwave Login',
    register: 'Registrieren',
  }
}

export type LoginData = {
  email: string,
  password: string,
}

type LoginPageProps = {
  login: () => Promise<boolean>,
}

export const LoginPage = ({ login, overwriteTranslation }: PropsForTranslation<LoginTranslation, LoginPageProps>) => {
  const translation = useTranslation(defaultLoginTranslations, overwriteTranslation)

  return (
    <Page
      pageTitle={titleWrapper(translation.login)}
      mainContainerClassName="items-center justify-center min-h-[90vh]"
      contentAndFooterClassName="items-center"
      isHidingSidebar={true}
    >
      <div className="col bg-gray-100 max-w-[300px] p-8 gap-y-2 rounded-lg shadow-lg">
        <h2 className="font-bold font-inter text-2xl">{translation.login}</h2>
        <SolidButton onClick={login}>{translation.signIn}</SolidButton>
      </div>
    </Page>
  )
}
