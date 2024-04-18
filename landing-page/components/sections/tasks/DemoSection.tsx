import { tw } from '@helpwave/common/twind'
import { Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'

const DemoSection = () => {
  const demoURL = 'https://staging-tasks.helpwave.de'

  return (
    <div>
      <Link href={demoURL} target="_blank">
        <div className={tw('font-space text-4xl font-bold underline text-center justify-center')}>
          Try <span className={tw('text-blue-400 text-6xl')}>Open Beta</span> now!
          <LinkIcon className={tw('ml-4 inline text-gray-400')} />
        </div>
      </Link>
    </div>
  )
}

export default DemoSection
