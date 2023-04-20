import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { tw } from '@helpwave/common/twind/index'
import { loginWithCredentials } from '../utils/login'
import { Input } from '../components/user_input/Input'
import { Checkbox } from '../components/user_input/Checkbox'
import { Button } from '../components/Button'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import HelpwaveLogo from '../icons/Helpwave'
import titleWrapper from '../utils/titleWrapper'

type LoginTranslation = {
  signInHeader: string,
  contactSubheader: {
    or: string,
    contactUs: string,
    getAccess: string
  },
  username: string,
  password: string,
  stayLoggedIn: string,
  forgotPassword: string,
  signIn: string
}

const defaultLoginTranslation: Record<Languages, LoginTranslation> = {
  en: {
    signInHeader: 'Sign in to your organization',
    contactSubheader: {
      or: 'Or ',
      contactUs: 'contact us',
      getAccess: ' to get access.'
    },
    username: 'Username',
    password: 'Password',
    stayLoggedIn: 'Remember me',
    forgotPassword: 'Forgot your password?',
    signIn: 'Sign in'
  },
  de: {
    signInHeader: 'Melden Sie sich bei Ihrer Organisation an',
    contactSubheader: {
      or: 'Oder ',
      contactUs: 'kontaktieren Sie uns',
      getAccess: ' um Zugang zu erhalten.'
    },
    username: 'Benutzername',
    password: 'Passwort',
    stayLoggedIn: 'Angemeldet bleiben',
    forgotPassword: 'Passwort vergessen?',
    signIn: 'Anmelden'
  }
}

const LoginPage: NextPage<PropsWithLanguage<LoginTranslation>> = (props) => {
  const router = useRouter()
  const translation = useTranslation(props.language, defaultLoginTranslation)
  const [rememberMe, setRememberMe] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // TODO: input validation?
    loginWithCredentials({ username: '', password: '', shouldRetrieveRefreshToken: rememberMe })
      .then(({ accessToken, refreshToken }) => {
        if (refreshToken !== null) {
          Cookies.set('jwt-refresh-token', refreshToken)
        }
        Cookies.set('jwt-access-token', accessToken)

        if (router.query.back) {
          router.back()
        } else {
          router.push('/')
        }
      })
      .catch(err => {
        // TODO: somehow display error messages
        console.error(err)
      })
  }

  return (
    <div>
        <Head>
          <title>{titleWrapper('Login')}</title>
        </Head>
        <div className={tw('flex items-center justify-center py-12 px-4')}>
          <div className={tw('w-full max-w-md space-y-8')}>
            <div>
              <HelpwaveLogo className={tw('mx-auto h-12 w-auto')}/>
              <h2
                className={tw('mt-6 text-center text-3xl font-bold tracking-tight text-gray-900')}>{translation.signInHeader}</h2>
              <p className={tw('mt-4 text-center text-sm text-gray-600')}>
                {translation.contactSubheader.or}
                <Link href="/contact" passHref className={tw('font-medium text-indigo-600 hover:text-indigo-500')}>
                  {translation.contactSubheader.contactUs}
                </Link>
                {translation.contactSubheader.getAccess}
              </p>
            </div>
            <form onSubmit={e => e.preventDefault()}>
              <div className={tw('flex flex-col mt-8 space-y-4 items-center')}>
                <div className={tw('w-80')}>
                  <Input id="login:username" required autoComplete="username" placeholder={translation.username}
                         label={translation.username} value={username} onChange={setUsername}/>
                </div>
                <div className={tw('w-80')}>
                  <Input id="login:password" required autoComplete="current-password" placeholder={translation.password}
                         label={translation.password} value={password} onChange={setPassword}/>
                </div>

                <div className={tw('flex items-center justify-between w-80')}>
                  <Checkbox id="login:remember-me" label={translation.stayLoggedIn} onChange={setRememberMe}
                            checked={rememberMe}/>
                  <div className={tw('text-sm')}>
                    <Link href="/forgot-password" passHref
                          className={tw('font-medium text-indigo-600 hover:text-indigo-500')}>
                      {translation.forgotPassword}
                    </Link>
                  </div>
                </div>
                <div className={tw('w-80')}>
                  <Button color="accent" variant="primary" size="large" onClick={handleLogin} type="submit">
                    {translation.signIn}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
    </div>
  )
}

export default LoginPage
