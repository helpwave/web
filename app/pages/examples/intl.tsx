import type { NextPage } from 'next'
import Title from '../../components/examples/Title'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { ProvideLanguage } from '../../hooks/useLanguage'

const Intl: NextPage = () => {
  return (
    <ProvideLanguage>
      <div className="flex justify-center items-center h-screen">
        <Title name="Testine Test" />
        <LanguageSwitcher />
      </div>
    </ProvideLanguage>
  )
}

export default Intl
