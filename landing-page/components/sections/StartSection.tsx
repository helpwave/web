import { tw } from '@helpwave/common/twind'
import Footer from '../Footer'
import { HelpwaveSpinner } from '@helpwave/common/icons/HelpwaveSpinner'

const StartSection = () => {
  return (
    <div className={tw('w-screen h-screen bg-white')} id="start">
      <HelpwaveSpinner className={tw('absolute top-[25px] left-1/2 -translate-x-1/2')} height="72" width="96" />
      <div className={tw('relative top-[40vh] m-auto')}>
          <div className={tw('font-space text-6xl font-bold text-center')}>helpwave</div>

        <div className={tw('font-sans text-2xl font-medium mt-2 text-center')}>
          {'empowering '}
          <span className={tw('text-hw-primary-400')}>{'medical heroes'}</span>
          {', united in '}
          <span className={tw('text-hw-pool-green')}>{'technology'}</span>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default StartSection
