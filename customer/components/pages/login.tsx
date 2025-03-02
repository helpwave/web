import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Page } from '@/components/layout/Page'
import titleWrapper from '@/utils/titleWrapper'
import { tw } from '@twind/core'
import { Input } from '@helpwave/common/components/user-input/Input'
import { useState } from 'react'
import { Button } from '@helpwave/common/components/Button'

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
    signIn: 'Sign In',
    register: 'Register',
  },
  de: {
    login: 'Login',
    email: 'Email',
    password: 'Passwort',
    signIn: 'Einloggen',
    register: 'Registrieren',
  }
}

export type LoginData = {
  email: string,
  password: string,
}

type LoginPageProps = {
  login: (data: LoginData) => Promise<boolean>,
}

export const LoginPage = ({ login, overwriteTranslation }: PropsForTranslation<LoginTranslation, LoginPageProps>) => {
  const translation = useTranslation(defaultLoginTranslations, overwriteTranslation)
  const [loginData, setLoginData] = useState<LoginData>({ email: '', password: '' })

  return (
    <Page
      pageTitle={titleWrapper(translation.login)}
      mainContainerClassName={tw('items-center justify-center min-h-[90vh]')}
      contentAndFooterClassName={tw('items-center')}
      isHidingSidebar={true}
    >
      <div className={tw('flex flex-col bg-gray-100 max-w-[300px] p-8 gap-y-2 rounded-lg shadow-lg')}>
        <h2 className={tw('font-bold font-inter text-2xl')}>{translation.login}</h2>
        <Input
          label={{ name: translation.email }}
          value={loginData.email}
          type="email"
          onChange={email => setLoginData({ ...loginData, email })}
        />
        <Input
          label={{ name: translation.password }}
          value={loginData.password}
          type="password"
          onChange={password => setLoginData({ ...loginData, password })}
        />
        <Button onClick={() => {
          login(loginData)
        }}>{translation.signIn}</Button>

        <Button onClick={() => {
        }} className={tw('mt-6')}>{translation.register}</Button>
      </div>
    </Page>
  )
}
