import { Span } from '@helpwave/common/components/Span'
import { tw } from '@helpwave/common/twind'
import Link from 'next/link'

const items = [
  { name: 'home', url: '/' },
  { name: 'tasks', url: '/tasks' },
  { name: 'story', url: '/story' },
  { name: 'talks', url: '/talks' },
  { name: 'contact', url: '/contact' },
]

const Navigation = () => {
  return (
    <div className={tw('shadow-lg px-5 max-w-screen fixed left-1/2 top-[40px] -translate-x-1/2 rounded-md border bg-white z-50')}>
      <div className={tw('h-[64px] align-middle flex flex-wrap gap-8 items-center justify-between mx-auto p-4')}>
        {items.map(({ name, url }) => (
        <div key={url} className={tw('text-xl group')}>
            <Link href={url}>
              <Span type="navigationItem">
                {name}
              </Span>
            </Link>
            <div className={tw('mx-auto mt-1 h-[3px] w-[80%] bg-transparent group-hover:bg-current')} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Navigation
