import { tw, tx } from '@helpwave/common/twind'
import { Link as LinkIcon, Mouse } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const StartSection = () => {
  const demoURL = 'https://staging-tasks.helpwave.de'
  const screenshotURL = 'https://cdn.helpwave.de/screenshots/tasks_1.png'
  const size = 1024

  return (
    <div className={tw('pt-32 pb-16')}>
      <Link href={demoURL} target="_blank">
        <h1 className={tw('font-space text-6xl font-bold')}>
          helpwave <span className={tw('text-hw-primary-800')}>tasks</span>
          <LinkIcon className={tw('ml-4 inline text-gray-400')} />
        </h1>
      </Link>

      <h4 className={tw('font-sans text-2xl font-medium mt-2 text-gray-600')}>
        The first open-source team management platform for healthcare workers
      </h4>

      <Image alt="Screenshots" src={screenshotURL} style={{ objectFit: 'contain' }} width={size} height={size} className={tx(`w-[${size}px] shadow-md hover:shadow-2xl transition-all duration-500 w-full rounded-md mt-8`)} />

      <div className={tw('mt-16 text-xl text-center animate-bounce')}>
        <Mouse className={tw('inline')} /> scroll
      </div>
      <div className={tw('mt-16 text-xl text-center')}>
        <p> <span className={tw('font-space font-bold')}>helpwave</span> <span className={tw('text-hw-primary-800')}>tasks</span> increases the productivity in your clinical team. Ditch your print-out ward list and coordinate your work and the work of your team in a modern kanban interface. <span className={tw('font-space font-bold')}>helpwave</span> <span className={tw('text-hw-primary-800')}>tasks</span> has been inspired by modern industry work flows and best practices from lean project management and applies them to the clinical environment.</p>
      </div>
    </div>
  )
}

export default StartSection
