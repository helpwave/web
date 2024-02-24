import { Span } from '@helpwave/common/components/Span'
import { tw, tx } from '@helpwave/common/twind'
import Image from 'next/image'

const FeatureSection = () => {
  const screenshotTemplates = 'https://cdn.helpwave.de/screenshots/tasks_2.png'
  const screenshotCollab = 'https://cdn.helpwave.de/screenshots/tasks_3.png'
  const screenshotPatients = 'https://cdn.helpwave.de/screenshots/tasks_4.png'
  const size = 1024

  return (
    <>
      <div className={tw('mt-8 pb-8 items-center desktop:gap-8 tablet:px-8 desktop:px-0 flex flex-wrap justify-between')}>
        <div className={tw('w-1/2')}>
          <Image alt="Screenshots" src={screenshotTemplates} style={{ objectFit: 'contain' }} width={size} height={size} className={tx(`w-[${size}px] shadow-md hover:shadow-2xl transition-all duration-500 w-full rounded-md mt-8`)} />
        </div>

        <div className={tw('w-1/3')}>
          <span className={tw('text-4xl font-space')}>
            Task Templates
          </span>
          <br />
          <Span type="description" className={tw('text-gray-600')}>
            Save repetitive tasks as templates. Standardize your workflows, share them with your team.
          </Span>
        </div>
      </div>

      <div className={tw('pb-8 items-center desktop:gap-16 tablet:px-8 desktop:px-0 flex flex-wrap justify-between')}>
        <div className={tw('w-1/3 text-end')}>
          <span className={tw('text-4xl font-space')}>
            Collaborate
          </span>
          <br />
          <Span type="description" className={tw('text-gray-600')}>
            You and your team synchronized on the same heartbeat.
          </Span>
        </div>

        <div className={tw('w-1/2')}>
          <Image alt="Screenshots" src={screenshotCollab} style={{ objectFit: 'contain' }} width={size} height={size} className={tx(`w-[${size}px] shadow-md hover:shadow-2xl transition-all duration-500 w-full rounded-md mt-8`)} />
        </div>
      </div>

      <div className={tw('pb-8 items-center desktop:gap-16 tablet:px-8 desktop:px-0 flex flex-wrap justify-between')}>
        <div className={tw('w-1/2')}>
          <Image alt="Screenshots" src={screenshotPatients} style={{ objectFit: 'contain' }} width={size} height={size} className={tx(`w-[${size}px] shadow-md hover:shadow-2xl transition-all duration-500 w-full rounded-md mt-8`)} />
        </div>

        <div className={tw('w-1/3')}>
          <span className={tw('text-4xl font-space')}>
            Patients
          </span>
          <br />
          <Span type="description" className={tw('text-gray-600')}>
            Modern dashboards for your patients. Keep track of their progress and tasks.
          </Span>
        </div>
      </div>
    </>
  )
}

export default FeatureSection
