import clsx from 'clsx'
import { Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import { SectionBase } from '@/components/sections/SectionBase'

const DemoSection = () => {
  const demoURL = 'https://staging-tasks.helpwave.de'

  return (
    <SectionBase backgroundColor="white">
      <Link href={demoURL} target="_blank">
        <div className={clsx('font-space text-4xl font-bold underline text-center justify-center')}>
          Try <span className={clsx('text-blue-400 text-6xl')}>Open Beta</span> now!
          <LinkIcon className={clsx('ml-4 inline text-gray-400')}/>
        </div>
      </Link>
    </SectionBase>
  )
}

export default DemoSection
