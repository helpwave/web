import { Span } from '@helpwave/common/components/Span'
import { Helpwave } from '@helpwave/common/icons/Helpwave'
import { tw } from '@helpwave/common/twind'
import { Menu as MenuIcon, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, MenuItem } from '@helpwave/common/components/user-input/Menu'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import { Chip } from '@helpwave/common/components/ChipList'

const homeURL = '/'

const linkNames = ['products', 'story', 'team', 'tasks'] as const
type LinkNames = typeof linkNames[number]

type LinkType = {
  name: LinkNames,
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
]

type HeaderTranslation = {
  contact: string
} & { [key in LinkNames]: string }

const defaultHeaderTranslation: Record<Languages, HeaderTranslation> = {
  en: {
    products: 'Products',
    story: 'Story',
    team: 'Team',
    contact: 'Contact us',
    tasks: 'tasks',
  },
  de: {
    products: 'Produkte',
    story: 'Geschichte',
    team: 'Team',
    contact: 'Kontakt',
    tasks: 'tasks',
  }
}

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const translation = useTranslation(defaultHeaderTranslation, {})

  const navigationItemStyle = tw('!font-bold font-space')

  return (
    <div>
      <div className={tw('w-screen z-[50] fixed top-0 bg-white')}>
        <nav className={tw('flex mobile:p-2 desktop:px-16 items-center justify-between mobile:mx-auto w-full')}>
          <Link href={homeURL} className={tw('flex flex-row gap-x-1 items-center text-2xl')}>
            <Helpwave/>
            <MarkdownInterpreter text={'\\helpwave'}/>
          </Link>
          <div className={tw('mobile:hidden w-full')}>
            <div className={tw('flex flex-wrap items-center justify-end gap-x-6')}>
              {items.map(({
                name,
                url,
                subpage
              }) => (
                <div key={name}>
                  {subpage === undefined ? (
                    <Link href={url}>
                      <Span className={navigationItemStyle}>
                        {translation[name]}
                      </Span>
                    </Link>
                  ) : (
                    <Menu<HTMLDivElement>
                      alignment="tl"
                      trigger={(onClick, ref) => (
                        <div ref={ref} onClick={onClick} className={tw('cursor-pointer select-none')}>
                          <Span className={navigationItemStyle}>
                            {translation[name]}
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
                              <Span className={navigationItemStyle}>
                                {subPageName}
                              </Span>
                            </MenuItem>
                          </Link>
                        ))}
                    </Menu>
                  )}
                </div>
              ))}
              <Link href="mailto:contact@helpwave.de">
                <Chip
                  variant="fullyRounded"
                  color="black"
                  className={tw('!py-2 !px-4 shadow-sm cursor-pointer')}
                >
                  {translation.contact}
                </Chip>
              </Link>
            </div>
          </div>
          <button onClick={() => setNavbarOpen(true)} className={tw('desktop:hidden content-end')}
                  aria-controls="navbar" aria-expanded="false">
            <MenuIcon size={32}/>
          </button>
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
