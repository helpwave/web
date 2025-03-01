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

type LinkNames = 'products'| 'mediquu'| 'story'| 'support'| 'team'| 'talks'| 'tasks'| 'appzumdoc'| 'netzmanager'

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
      <div className={tw('absolute flex flex-row justify-center top-0 w-screen z-[50] bg-hw-grayscale-50 mobile:px-6 tablet:px-12 desktop:px-24')}>
        <nav className={tw('flex pt-2 items-center justify-between w-full max-w-[1200px]')}>
          <Link href={homeURL} className={tw('flex flex-row gap-x-1 items-center text-2xl')}>
            <Helpwave />
            <MarkdownInterpreter text={'\\helpwave'} />
          </Link>
          <div className={tw('mobile:hidden w-full')}>
            <div className={tw('flex flex-wrap items-center justify-end gap-x-6')}>
              {items.map(({
                name,
                url,
                subpage,
              }) => (
                <div key={name}>
                  {subpage === undefined ? (
                    <Link href={url}>
                      <span className={tw('textstyle-navigation-item')}>
                        {translation[name]}
                      </span>
                    </Link>
                  ) : (
                    <Menu<HTMLDivElement>
                      alignment="tl"
                      trigger={(onClick, ref) => (
                        <div ref={ref} onClick={onClick} className={tw('cursor-pointer select-none')}>
                          <span className={tw('textstyle-navigation-item')}>
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
                        <Link key={subPageName} className={tw('cursor-pointer')} href={subPageExternal ? subPageUrl : url + subPageUrl}>
                          <MenuItem alignment="left">
                            <span className={tw('textstyle-navigation-item')}>
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
          <button onClick={() => setNavbarOpen(true)} className={tw('desktop:hidden tablet:hidden content-end')}
            aria-controls="navbar" aria-expanded="false">
            <MenuIcon size={32} />
          </button>
        </nav>
      </div>

      {navbarOpen && (
        <div className={tw('absolute w-screen h-screen z-[100] bg-hw-grayscale-50')}>
          <div className={tw('text-center content-center fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2')}>
            <button onClick={() => setNavbarOpen(false)} className={tw('mb-5')}>
              <X size={64} />
            </button>

            <div className={tw('w-full p-2')}>
              <Link href="/" onClick={() => setNavbarOpen(false)}>
                <span className={tw('textstyle-title-lg')}>
                  home
                </span>
              </Link>
            </div>

            {items.map(({
              name,
              url,
              subpage,
            }) => (
              <div key={name} className={tw('w-full p-2')}>
                {subpage === undefined ? (
                  <Link href={url} onClick={() => setNavbarOpen(false)}>
                    <span className={tw('textstyle-title-lg')}>
                      {translation[name]}
                    </span>
                  </Link>
                ) : (
                  <Menu<HTMLDivElement> alignment="tl" trigger={(onClick, ref) => (
                    <div ref={ref} onClick={onClick} className={tw('cursor-pointer select-none')}>
                      <span className={tw('textstyle-title-lg')}>
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
                      <Link key={subPageName} className={tw('cursor-pointer')} onClick={() => setNavbarOpen(false)}
                        href={subPageExternal ? subPageUrl : url + subPageUrl}>
                        <MenuItem alignment="left">
                          <span className={tw('textstyle-title-lg')}>
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
