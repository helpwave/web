import Link from 'next/link'

const items = [
  { name: 'Team', link: '#team' },
  { name: 'Roadmap', link: '#roadmap' },
  { name: 'About', link: '#about' },
  { name: 'Contact us', link: '#contact-us' },
]

// TODO: colors
const Header = () => {
  return (
    <div className="font-space text-xl py-2 px-4 flex justify-end">
      <div className="flex flex-row gap-8">
        {items.map(({ name, link }) => (
          <div key={link} className="group">
            <Link href={link} className="py-1">{name}</Link>
            <div className="mx-auto mt-1 h-[3px] w-[80%] bg-transparent group-hover:bg-current" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Header
