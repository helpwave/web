import Link from 'next/link'
import { tw } from '@helpwave/common/twind'

const socials = [
  { name: 'GitHub', link: 'https://github.com/helpwave/' },
  { name: 'LinkedIn', link: 'https://linkedin.com/company/helpwave/' },
  { name: 'Instagram', link: 'https://instagram.com/helpwave_de/' },
  { name: 'Twitter', link: 'https://twitter.com/helpwave_org' },
  { name: 'YouTube', link: 'https://www.youtube.com/@helpwave' },
  { name: 'Twitch', link: 'https://www.twitch.tv/helpwave' },
]

const Header = () => {
  return (
      <div className={tw('absolute left-1/2 bottom-[40px] -translate-x-1/2')}>
        <div className={tw('flex flex-row gap-8')}>
          {socials.map(({ name, link }) => (
            <div key={link} className={tw('group')}>
              <Link target="_blank" href={link} className={tw('py-1')}>{name}</Link>
              <div className={tw('mx-auto mt-1 h-[3px] w-[80%] bg-transparent group-hover:bg-current')} />
            </div>
          ))}
        </div>
    </div>
  )
}

export default Header
