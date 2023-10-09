import { Span } from '@helpwave/common/components/Span'
import { Helpwave } from '@helpwave/common/icons/Helpwave'
import { tw } from '@helpwave/common/twind'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

const items = [
  { name: 'home', url: '/' },
  { name: 'tasks', url: 'https://tasks.helpwave.de' },
  { name: 'story', url: '/' },
  { name: 'talks', url: '/' },
  { name: 'contact', url: '/' },
]

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false)

  return (
    <div>
      <div className={tw('w-screen z-[50] fixed shadow-sm top-0 border bg-white')}>
        <nav className={tw('flex mobile:p-5 desktop:w-5/12 items-center justify-between mx-auto')}>
          <Link href="/">
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

          <div className={tw('tablet:hidden desktop:hidden content-end')}>
            <button onClick={() => setNavbarOpen(true)} className={tw('tablet:hidden desktop:hidden content-end')} aria-controls="navbar" aria-expanded="false">
              <Menu size={32}/>
            </button>
          </div>
        </nav>
      </div>

      {navbarOpen && (
        <div className={tw('fixed w-screen h-screen z-[100] bg-white')}>
          <div className={tw('text-center content-center fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2')}>
            <button onClick={() => setNavbarOpen(false)} className={tw('pb-5')}>
              <X size={64} />
            </button>
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
