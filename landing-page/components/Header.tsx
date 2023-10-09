import { Span } from '@helpwave/common/components/Span'
import { Helpwave } from '@helpwave/common/icons/Helpwave'
import { tw } from '@helpwave/common/twind'
import Link from 'next/link'

const items = [
  { name: 'home', url: '/' },
  { name: 'tasks', url: 'https://tasks.helpwave.de' },
  { name: 'story', url: '/' },
  { name: 'talks', url: '/' },
  { name: 'contact', url: '/' },
]

const Header = () => {
  return (
    <div className={tw('w-screen z-50 fixed shadow-sm top-0 border bg-white')}>
      <div className={tw('flex w-5/12 items-center justify-between mx-auto')}>
        <Link href="/">
          <Helpwave />
        </Link>

        {items.map(({ name, url }) => (
        <div key={url} className={tw('text-xl group')}>
            <Link href={url}>
            <Span type="navigationItem">
               {name}
            </Span>
          </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Header
