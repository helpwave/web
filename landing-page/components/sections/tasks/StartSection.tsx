import { tw } from '@helpwave/common/twind'

const StartSection = () => {
  return (
    <div className={tw('pt-48 pb-16 flex gap-32 items-center justify-center')}>
      <div className={tw('desktop:w-1/2')}>
        <div className={tw('font-space text-6xl font-bold')}>helpwave <span className={tw('text-hw-primary-800')}>tasks</span></div>

        <div className={tw('font-sans text-2xl font-medium mt-2')}>
          The first open-source team management platform for healthcare workers
        </div>
      </div>

      <div className={tw('mobile:hidden w-2/7')}>
      </div>
    </div>
  )
}

export default StartSection
