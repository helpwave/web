import type { NextPage } from 'next'
import { tw } from '@helpwave/common/twind'
import Title from '../../../lib/components/examples/Title'
import LanguageSwitcher from '@helpwave/common/components/LanguageSwitcher'
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
