import { tw, tx } from '@helpwave/common/twind'
import Image from 'next/image'

const StartSection = () => {
  const screenshotURL = 'https://cdn.helpwave.de/screenshots/tasks_1.png'
  const size = 1024

  return (
    <div className={tw('pt-48 pb-16')}>
      <div className={tw('font-space text-6xl font-bold')}>helpwave <span className={tw('text-hw-primary-800')}>tasks</span></div>

      <div className={tw('font-sans text-2xl font-medium mt-2')}>
        The first open-source team management platform for healthcare workers
      </div>

      <Image alt="Screenshots" src={screenshotURL} style={{ objectFit: 'contain' }} width={size} height={size} className={tx(`w-[${size}px] shadow-2xl w-full rounded-md mt-8`)}/>
    </div>
  )
}

export default StartSection
