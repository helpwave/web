import { forwardRef } from 'react'
import { tw } from '@twind/core'
import Header from '../Header'
import Helpwave from '../../icons/Helpwave'
import { Checkbox } from '../Checkbox'

const StartSection = forwardRef<HTMLDivElement>(function StartSection(_, ref) {
  return (
    <div className={tw('w-full h-screen bg-hw-temp-gray-c text-white')} id="start" ref={ref}>
      <div className={tw('py-8 px-16')}>
        <Header />
      </div>
      <div className={tw('relative top-[30vh] m-auto w-[580px]')}>
        <div className={tw('flex justify-between')}>
          <div className={tw('font-space text-7xl font-bold')}>helpwave</div>
          <Helpwave className={tw('align-center')} height="64" width="64" />
        </div>

        <div className={tw('font-sans text-2xl font-medium mt-4')}>
          {'Bei helpwave entwickeln wir keine Software für das Gesundheitssystem, sondern mit ihm. '}<br />
          {'In diesem Zusammenschluss aus Ärzten, Entwicklern und weiteren frischen Geistern, '}<br />
          {'entstehen '}
          <span className={tw('text-hw-primary-400')}>{'echte'}</span>
          {' Lösungen für '}
          <span className={tw('text-hw-temp-red')}>{'echte'}</span>
          {' Menschen.'}
        </div>

        <div className={tw('p-4 flex gap-16')}>
          <div className={tw('flex flex-col')}>
            <div className={tw('p-2')}><Checkbox checked={true} onChange={() => undefined} disabled id="feature-1" label="Intuitiv" /></div>
            <div className={tw('p-2')}><Checkbox checked={true} onChange={() => undefined} disabled id="feature-2" label="Kollaborativ" /></div>
            <div className={tw('p-2')}><Checkbox checked={true} onChange={() => undefined} disabled id="feature-3" label="Praxisnah" /></div>
          </div>
          <div className={tw('flex flex-col')}>
            <div className={tw('p-2')}><Checkbox checked={true} onChange={() => undefined} disabled id="feature-4" label="Sicher" /></div>
            <div className={tw('p-2')}><Checkbox checked={true} onChange={() => undefined} disabled id="feature-5" label="Interprofessionell" /></div>
            <div className={tw('p-2')}><Checkbox checked={true} onChange={() => undefined} disabled id="feature-6" label="Open-Source" /></div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default StartSection
