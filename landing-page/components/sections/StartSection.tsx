import { tw } from '@helpwave/common/twind'

const StartSection = () => {
  return (
    <div className={tw('relative top-[40vh] m-auto')}>
      <div className={tw('font-space text-6xl font-bold text-center')}>helpwave</div>

      <div className={tw('font-sans text-2xl font-medium mt-2 text-center')}>
        {'empowering '}
        <span className={tw('text-hw-primary-400')}>{'medical heroes'}</span>
        {', united in '}
        <span className={tw('text-hw-pool-green')}>{'technology'}</span>
      </div>
    </div>
  )
}

export default StartSection
