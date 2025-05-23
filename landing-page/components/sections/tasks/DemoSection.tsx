import { Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import { SectionBase } from '@/components/sections/SectionBase'

const DemoSection = () => {
  const demoURL = 'https://tasks.helpwave.de'

  return (
    <SectionBase backgroundColor="variant">
      <Link href={demoURL} target="_blank">
        <div className="font-space text-4xl font-bold underline text-center justify-center">
          Try <span className="text-blue-400 text-6xl">Demo</span> now!
          <LinkIcon className="ml-4 inline text-gray-400" />
        </div>
      </Link>
    </SectionBase>
  )
}

export default DemoSection
