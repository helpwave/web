import type { NextPage } from 'next'
import { tw } from '@helpwave/common/twind'
import { SignInButton } from '@helpwave/common/components/SignInButton'
import { getAuthorizationUrl } from '../../utils/oauth'

const Auth: NextPage = () => {
  return (
    <div className={tw('flex flex-col items-center w-screen h-screen justify-center')}>
      <SignInButton
        onClick={() => {
          getAuthorizationUrl().then((url) => window.location.assign(url))
        }}
      />
    </div>
  )
}

export default Auth
