import { Span } from '@helpwave/common/components/Span'
import { Helpwave } from '@helpwave/common/icons/Helpwave'
import { tw } from '@helpwave/common/twind'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const homeURL = '/'

const items = [
  { name: 'tasks', url: '/product/tasks' },
  { name: 'story', url: '/story' },
  { name: 'team', url: '/team' },
  { name: 'talks', url: '/talks' },
  { name: 'contact', url: 'mailto:contact@helpwave.de' },
]

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false)

  return (
    <div>
      <div className={tw('w-screen z-[50] fixed shadow-sm top-0 border bg-white')}>
        <nav className={tw('flex mobile:p-2 desktop:w-5/12 items-center justify-between mx-auto')}>
          <Link href={homeURL}>
            <Helpwave />
          </Link>

          <div className={tw('phone:hidden w-full')}>
            <div className={tw('flex flex-wrap items-center justify-evenly')}>
              {items.map(({ name, url }) => (
                <div key={name}>
                  <Link href={url}>
                    <Span type="navigationItem">
                      {name}
                    </Span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className={tw('w-full tablet:hidden desktop:hidden flex justify-between mx-2')}>
            <Link href={homeURL}><span className={tw('text-center text-2xl font-bold font-space')}>helpwave</span></Link>
            <button onClick={() => setNavbarOpen(true)} className={tw('tablet:hidden desktop:hidden content-end')} aria-controls="navbar" aria-expanded="false">
              <Menu size={32}/>
            </button>
          </div>
        </nav>
      </div>

      {navbarOpen && (
        <div className={tw('fixed w-screen h-screen z-[100] bg-white')}>
          <div className={tw('text-center content-center fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2')}>
            <button onClick={() => setNavbarOpen(false)} className={tw('mb-5')}>
              <X size={64} />
            </button>

            <div className={tw('w-full p-2')}>
              <Link href="/" onClick={() => setNavbarOpen(false)}>
                <Span type="heading">
                  home
                </Span>
              </Link>
            </div>

            {items.map(({ name, url }) => (
              <div key={name} className={tw('w-full p-2')}>
                <Link href={url} onClick={() => setNavbarOpen(false)}>
                  <Span type="heading">
                    {name}
                  </Span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
