import type { NextPage } from 'next'
import { tw } from '@twind/core'
import Title from '../../components/examples/Title'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { ProvideLanguage } from '@helpwave/common/hooks/useLanguage'

const Intl: NextPage = () => {
  return (
    <ProvideLanguage>
      <div className={tw('flex justify-center items-center h-screen')}>
        <Title name="Testine Test" />
        <LanguageSwitcher />
      </div>
    </ProvideLanguage>
  )
}

export default Intl
