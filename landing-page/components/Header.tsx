import Link from 'next/link'
import { tw } from '@twind/core'

const items = [
  { name: 'Team', link: '#team' },
  { name: 'Roadmap', link: '#roadmap' },
  { name: 'About', link: '#about' },
  { name: 'Contact us', link: '#contact' },
]

// TODO: colors
const Header = () => {
  return (
    <div className={tw('font-space text-xl py-2 px-4 flex justify-end')}>
      <div className={tw('flex flex-row gap-8')}>
        {items.map(({ name, link }) => (
          <div key={link} className={tw('group')}>
            <Link href={link} className={tw('py-1')}>{name}</Link>
            <div className={tw('mx-auto mt-1 h-[3px] w-[80%] bg-transparent group-hover:bg-current')} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Header
