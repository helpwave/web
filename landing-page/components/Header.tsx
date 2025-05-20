import { Menu as MenuIcon, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { Helpwave, MarkdownInterpreter, Menu, MenuItem, useTranslation } from '@helpwave/hightide'
import type { Languages } from '@helpwave/hightide'
const homeURL = '/'

type LinkNames = 'products' | 'mediquu' | 'story' | 'support' | 'team' | 'talks' | 'tasks' | 'appzumdoc' | 'netzmanager'

type LinkType = {
  name: LinkNames,
  url: string,
  external?: boolean,
}

type SubLinkType = LinkType & {
  subpage?: LinkType[],
}

const items: SubLinkType[] = [
  {
    name: 'products',
    url: '/product',
    subpage: [
      {
        name: 'tasks',
        url: '/tasks',
      },
      {
        name: 'appzumdoc',
        url: 'https://app-zum-doc.de',
        external: true
      },
      {
        name: 'netzmanager',
        url: 'https://mediquu.de/mediquu_netzmanager.html',
        external: true
      }
    ]
  },
  {
    name: 'mediquu',
    url: '/mediquu'
  },
  {
    name: 'story',
    url: '/story'
  },
  {
    name: 'talks',
    url: '/talks'
  },
  {
    name: 'support',
    url: 'https://support.helpwave.de',
    external: true
  },
  {
    name: 'team',
    url: '/team'
  },
]

type HeaderTranslation = {
  contact: string,
} & { [key in LinkNames]: string }

const defaultHeaderTranslation: Record<Languages, HeaderTranslation> = {
  en: {
    products: 'Products',
    mediquu: 'mediQuu',
    story: 'Story',
    team: 'Team',
    contact: 'Contact us',
    tasks: 'tasks',
    support: 'Support',
    talks: 'Podcast',
    appzumdoc: 'App Zum Doc',
    netzmanager: 'mediQuu Netzmanager',
  },
  de: {
    products: 'Produkte',
    mediquu: 'mediQuu',
    story: 'Geschichte',
    team: 'Team',
    contact: 'Kontakt',
    tasks: 'tasks',
    support: 'Hilfe',
    talks: 'Podcast',
    appzumdoc: 'App Zum Doc',
    netzmanager: 'mediQuu Netzmanager',
  }
}

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const translation = useTranslation(defaultHeaderTranslation, {})

  return (
    <>
      <div className="absolute top-0 z-[50] row justify-center w-screen section-padding-x">
        <nav className="row pt-2 items-center justify-between w-full max-w-[1200px]">
          <Link href={homeURL} className="row gap-x-1 items-center text-2xl">
            <Helpwave/>
            <MarkdownInterpreter text={'\\helpwave'}/>
          </Link>
          <div className="max-tablet:hidden w-full">
            <div className="flex flex-wrap items-center justify-end gap-x-6">
              {items.map(({
                            name,
                            url,
                            external,
                            subpage,
                          }) => (
                <div key={name}>
                  {subpage === undefined ? (
                    <Link href={url} target={external ? '_blank' : undefined}>
                      <span className="textstyle-navigation-item">
                        {translation[name]}
                      </span>
                    </Link>
                  ) : (
                    <Menu<HTMLDivElement>
                      alignment="tl"
                      trigger={(onClick, ref) => (
                        <div ref={ref} onClick={onClick} className="cursor-pointer select-none">
                          <span className="textstyle-navigation-item">
                            {translation[name]}
                          </span>
                        </div>
                      )}
                      showOnHover={true}
                    >
                      {subpage.map(({
                                      name: subPageName,
                                      url: subPageUrl,
                                      external: subPageExternal,
                                    }) =>
                        (
                          <Link key={subPageName} href={subPageExternal ? subPageUrl : url + subPageUrl} target={subPageExternal ? '_blank' : undefined}>
                            <MenuItem alignment="left">
                            <span className="textstyle-navigation-item">
                              {translation[subPageName]}
                            </span>
                            </MenuItem>
                          </Link>
                        ))}
                    </Menu>
                  )}
                </div>
              ))}
              <Link href="mailto:contact@helpwave.de">
                <div
                  color="dark"
                  className="chip-full py-2 px-4 shadow-sm bg-white text-black font-bold hover:brightness-[98%]"
                >
                  {translation.contact}
                </div>
              </Link>
            </div>
          </div>
          <button onClick={() => setNavbarOpen(true)} className="tablet:hidden content-end"
                  aria-controls="navbar" aria-expanded="false">
            <MenuIcon size={32}/>
          </button>
        </nav>
      </div>

      {navbarOpen && (
        <div className="absolute w-screen h-screen z-[100] bg-background text-on-background">
          <div className="text-center content-center fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <button onClick={() => setNavbarOpen(false)} className="mb-5">
              <X size={64}/>
            </button>

            <div className="w-full p-2">
              <Link href="/" onClick={() => setNavbarOpen(false)}>
                <span className="textstyle-title-lg">
                  home
                </span>
              </Link>
            </div>

            {items.map(({
                          name,
                          url,
                          subpage,
                        }) => (
              <div key={name} className="w-full p-2">
                {subpage === undefined ? (
                  <Link href={url} onClick={() => setNavbarOpen(false)}>
                    <span className="textstyle-title-lg">
                      {translation[name]}
                    </span>
                  </Link>
                ) : (
                  <Menu<HTMLDivElement> alignment="tl" trigger={(onClick, ref) => (
                    <div ref={ref} onClick={onClick} className="cursor-pointer select-none">
                      <span className="textstyle-title-lg">
                        {translation[name]}
                      </span>
                    </div>
                  )}>
                    {subpage.map(({
                                    name: subPageName,
                                    url: subPageUrl,
                                    external: subPageExternal
                                  }) =>
                      (
                        <Link key={subPageName} onClick={() => setNavbarOpen(false)}
                              href={subPageExternal ? subPageUrl : url + subPageUrl}>
                          <MenuItem alignment="left">
                          <span className="textstyle-title-lg">
                            {translation[subPageName]}
                          </span>
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
    </>
  )
}

export default Header
