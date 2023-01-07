import { tw } from '@twind/core'
import Header from '../Header'
import Helpwave from '../../icons/Helpwave'
import { Checkbox } from '../Checkbox'

const StartSection = () => {
  return (
    <div className={tw('w-screen h-screen bg-hw-temp-gray-c text-white')} id="start">
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

        <div className={tw('p-4 flex gap-16')}>
          <div className={tw('flex flex-col')}>
            <div className={tw('p-2')}><Checkbox checked={true} onChange={() => undefined} disabled id="feature-1" label="Feature 1" /></div>
            <div className={tw('p-2')}><Checkbox checked={true} onChange={() => undefined} disabled id="feature-2" label="Feature 2" /></div>
            <div className={tw('p-2')}><Checkbox checked={true} onChange={() => undefined} disabled id="feature-3" label="Feature 3" /></div>
          </div>
          <div className={tw('flex flex-col')}>
            <div className={tw('p-2')}><Checkbox checked={true} onChange={() => undefined} disabled id="feature-4" label="Feature 4" /></div>
            <div className={tw('p-2')}><Checkbox checked={true} onChange={() => undefined} disabled id="feature-5" label="Feature 5" /></div>
            <div className={tw('p-2')}><Checkbox checked={true} onChange={() => undefined} disabled id="feature-6" label="Feature 6" /></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StartSection
