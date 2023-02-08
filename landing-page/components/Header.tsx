import Link from 'next/link'
import { tw } from '@helpwave/common/twind/index'

const items = [
  { name: 'Features', link: '#features' },
  { name: 'Partners & Team', link: '#partners_team' },
  { name: 'Contact', link: '#contact' },
]

const socials = [
  { name: 'GitHub', link: 'https://github.com/helpwave' },
  { name: 'LinkedIn', link: 'https://linkedin.com/company/helpwave/' },
  { name: 'Instagram', link: 'https://instagram.com/helpwave_de/' },
  { name: 'Twitter', link: 'https://twitter.com/helpwave_de/' },
]

const Header = () => {
  return (
    <div className={tw('flex flex-row justify-between')}>
      <div className={tw('font-space text-xl py-2 px-4 flex justify-start')}>
        <div className={tw('flex flex-row gap-8')}>
          {socials.map(({ name, link }) => (
            <div key={link} className={tw('group')}>
              <Link href={link} className={tw('py-1')}>{name}</Link>
              <div className={tw('mx-auto mt-1 h-[3px] w-[80%] bg-transparent group-hover:bg-current')} />
            </div>
          ))}
        </div>
      </div>
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
    </div>
  )
}

export default Header
