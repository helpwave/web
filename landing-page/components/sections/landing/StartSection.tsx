import { Button } from '@helpwave/common/components/Button'
import { tw } from '@helpwave/common/twind'

const StartSection = () => {
  const githubURL = 'https://github.com/helpwave'
  const demoURL = 'https://tasks.helpwave.de'

  return (
    <div className={tw('pt-32 pb-16 flex gap-32 items-center justify-center')}>
      <div className={tw('desktop:w-3/4')}>
        <div className={tw('font-space text-6xl font-bold')}>helpwave</div>

        <div className={tw('font-sans text-2xl font-medium mt-2 text-end')}>
          {'empowering '}
          <span className={tw('text-hw-primary-800')}>{'medical heroes'}</span>
          {', '}
          <br className={tw('mobile:hidden')}/>
          {'united in '}
          <span className={tw('text-green-600')}>{'technology'}</span>
        </div>

        <div className={tw('flex my-8 gap-8 mobile:justify-evenly')}>
          <Button variant="tertiary" color="neutral" onClick={() => { window.open(githubURL, '_blank') }} className={tw('flex items-center gap-2')}>
            explore
          </Button>

          <Button variant="textButton" color="neutral" onClick={() => { window.open(demoURL, '_blank') }} className={tw('flex items-center gap-2')}>
            try our demo!
          </Button>
        </div>
      </div>

      <div className={tw('mobile:hidden w-2/7')}>
      </div>
    </div>
  )
}

export default StartSection
