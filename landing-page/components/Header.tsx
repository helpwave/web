import { Span } from '@helpwave/common/components/Span'
import { Helpwave } from '@helpwave/common/icons/Helpwave'
import { tw } from '@helpwave/common/twind'
import { Menu as MenuIcon, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, MenuItem } from '@helpwave/common/components/user-input/Menu'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'

const homeURL = '/'

type LinkType = {
  name: string,
  url: string
}

type SubLinkType = LinkType & {
  subpage?: LinkType[]
}

const items: SubLinkType[] = [
  {
    name: 'products',
    url: '/product',
    subpage: [
      {
        name: 'tasks',
        url: '/tasks',
      }
    ]
  },
  {
    name: 'story',
    url: '/story'
  },
  {
    name: 'team',
    url: '/team'
  },
  {
    name: 'talks',
    url: '/talks'
  },
  {
    name: 'contact',
    url: 'mailto:contact@helpwave.de'
  },
]

type HeaderTranslation = {
  products: string,
  story: string,
  team: string,
  talks: string,
  contact: string
}

const defaultHeaderTranslation: Record<Languages, HeaderTranslation> = {
  en: {
    products: 'products',
    story: 'story',
    team: 'team',
    talks: 'talks',
    contact: 'contact',
  },
  de: {
    products: 'Produkte',
    story: 'Geschichte',
    team: 'Team',
    talks: 'tasks',
    contact: 'Kontakt',
  }
}

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const translation = useTranslation({}, defaultHeaderTranslation)

  return (
    <div>
      <div className={tw('w-screen z-[50] fixed shadow-sm top-0 border bg-white')}>
        <nav className={tw('flex mobile:p-2 desktop:w-5/12 items-center justify-between mx-auto')}>
          <Link href={homeURL}>
            <Helpwave/>
          </Link>
          <div className={tw('phone:hidden w-full')}>
            <div className={tw('flex flex-wrap items-center justify-evenly')}>
              {items.map(({
                name,
                url,
                subpage
              }) => (
                <div key={name}>
                  {subpage === undefined ? (
                    <Link href={url}>
                      <Span type="navigationItem">
                        {translation[name as keyof typeof translation]}
                      </Span>
                    </Link>
                  ) : (
                    <Menu<HTMLDivElement>
                      alignment="tl"
                      trigger={(onClick, ref) => (
                        <div ref={ref} onClick={onClick} className={tw('cursor-pointer select-none')}>
                          <Span type="navigationItem">
                            {translation[name as keyof typeof translation]}
                          </Span>
                        </div>
                      )}
                      showOnHover={true}
                    >
                      {subpage.map(({
                        name: subPageName,
                        url: subPageUrl
                      }) =>
                        (
                          <Link key={subPageName} className={tw('cursor-pointer')} href={url + subPageUrl}>
                            <MenuItem alignment="left">
                              <Span type="navigationItem">
                                {subPageName}
                              </Span>
                            </MenuItem>
                          </Link>
                        ))}
                    </Menu>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={tw('w-full tablet:hidden desktop:hidden flex justify-between mx-2')}>
            <Link href={homeURL}><span
              className={tw('text-center text-2xl font-bold font-space')}>helpwave</span></Link>
            <button onClick={() => setNavbarOpen(true)} className={tw('tablet:hidden desktop:hidden content-end')}
                    aria-controls="navbar" aria-expanded="false">
              <MenuIcon size={32}/>
            </button>
          </div>
        </nav>
      </div>

      {navbarOpen && (
        <div className={tw('fixed w-screen h-screen z-[100] bg-white')}>
          <div className={tw('text-center content-center fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2')}>
            <button onClick={() => setNavbarOpen(false)} className={tw('mb-5')}>
              <X size={64}/>
            </button>

            <div className={tw('w-full p-2')}>
              <Link href="/" onClick={() => setNavbarOpen(false)}>
                <Span type="heading">
                  home
                </Span>
              </Link>
            </div>

            {items.map(({
              name,
              url,
              subpage
            }) => (
              <div key={name} className={tw('w-full p-2')}>
                {subpage === undefined ? (
                  <Link href={url} onClick={() => setNavbarOpen(false)}>
                    <Span type="heading">
                      {name}
                    </Span>
                  </Link>
                ) : (
                  <Menu<HTMLDivElement> alignment="tl" trigger={(onClick, ref) => (
                    <div ref={ref} onClick={onClick} className={tw('cursor-pointer select-none')}>
                      <Span type="heading">
                        {name}
                      </Span>
                    </div>
                  )}>
                    {subpage.map(({
                      name: subPageName,
                      url: subPageUrl
                    }) =>
                      (
                        <Link key={subPageName} className={tw('cursor-pointer')} onClick={() => setNavbarOpen(false)}
                              href={url + subPageUrl}>
                          <MenuItem alignment="left">
                            <Span type="heading">
                              {subPageName}
                            </Span>
                          </MenuItem>
                        </Link>
                      ))}
                  </Menu>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
