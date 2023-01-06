import { tw } from '@twind/core'
import Header from './Header'
import Helpwave from './icons/Helpwave'

const StartSection = () => {
  return (
    <div className={tw('w-screen h-screen bg-hw-find-a-good-name-for-this-background text-white')}>
      <div className={tw('py-8 px-16')}>
        <Header />
      </div>
      <div className={tw('relative top-[30vh] m-auto w-[580px]')}>
        <div className={tw('flex justify-between')}>
          <div className={tw('font-space text-7xl font-bold')}>helpwave</div>
          <Helpwave className={tw('align-center')} height="52" width="64" />
        </div>

        <div className={tw('font-sans text-2xl font-medium mt-4')}>
          {"At helpwave, we don't see information technology"}<br />
          {'as an old marriage that has fallen asleep, but as'}<br />
          {'a '}
          <span className={tw('text-hw-primary-400')}>{'newly'}</span>
          {' & '}
          <span className={tw('text-hw-temp-red')}>{'rekindled'}</span>
          {' hot affair'}
        </div>
        </div>
      </div>
    </div>
  )
}

export default StartSection
