import { tw, tx } from '@helpwave/common/twind'
import { Link as LinkIcon, Mouse } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const StartSection = () => {
  const demoURL = 'https://tasks.helpwave.de'
  const screenshotURL = 'https://cdn.helpwave.de/screenshots/tasks_1.png'
  const size = 1024

  return (
    <div className={tw('pt-32 pb-16')}>
      <Link href={demoURL} target="_blank">
        <div className={tw('font-space text-6xl font-bold')}>
          helpwave <span className={tw('text-hw-primary-800')}>tasks</span>
          <LinkIcon className={tw('ml-4 inline text-gray-400')} />
        </div>
      </Link>

      <div className={tw('font-sans text-2xl font-medium mt-2')}>
        The first open-source team management platform for healthcare workers
      </div>

      <Image alt="Screenshots" src={screenshotURL} style={{ objectFit: 'contain' }} width={size} height={size} className={tx(`w-[${size}px] shadow-md hover:shadow-2xl transition-all duration-500 w-full rounded-md mt-8`)} />

      <div className={tw('mt-16 text-xl text-center animate-bounce')}>
        <Mouse className={tw('inline')} /> scroll
      </div>
    </div>
  )
}

export default StartSection
