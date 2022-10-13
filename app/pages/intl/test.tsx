import type { NextPage } from 'next'
import Title from './Title'
import LanguageSwitcher from './LangugeSwitcher'
import { ProvideLanguage } from '../../hooks/useLanguage'

const Test: NextPage = () => {
  return (
    <ProvideLanguage>
      <div className={'flex justify-center items-center h-screen'}>
        <Title name={'Testine Test'} />
        <LanguageSwitcher/>
      </div>
    </ProvideLanguage>
  )
}

export default Test
