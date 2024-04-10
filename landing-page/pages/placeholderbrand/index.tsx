import type { NextPage } from 'next'
import { tw } from '@helpwave/common/twind'
import { Span } from '@helpwave/common/components/Span'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Tile, TileWithImage } from '@helpwave/common/components/layout/Tile'
import { Helpwave } from '@helpwave/common/icons/Helpwave'
import { FAQSection } from '@helpwave/common/components/layout/FAQSection'
import type { ProfileProps } from '@helpwave/common/components/Profile'
import { Profile } from '@helpwave/common/components/Profile'
import { tx } from '@twind/core'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type PlaceholderbrandHeaderTranslation = {
  title: string,
  subTitle: string
}

const defaultPlaceholderbrandPageTranslation: Record<Languages, PlaceholderbrandHeaderTranslation> = {
  en: {
    title: 'This is the titel for this page',
    subTitle: 'This sentence gives more context for this page and helps to provide more information'
  },
  de: {
    title: 'Das ist ein Titel fpr diese Seite',
    subTitle: 'Dieser Satz gibt mehr Kontext für diese Seite und hilft, mehr Informationen zu liefern'
  }
}

const PlaceholderbrandHeaderSection = () => {
  const translation = useTranslation(defaultPlaceholderbrandPageTranslation)
  return (
    <div className={tw('flex desktop:flex-row mobile:flex-wrap gap-8 justify-center max-w-[1000px]')}>
      <div className={tw('flex flex-col gap-y-2 max-w-')}>
        <Span type="title" className={tw('!text-5xl')}>{translation.title}</Span>
        <Span className={tw('text-lg')}>{translation.subTitle}</Span>
      </div>
      <div className={tw('flex flex-col gap-y-4 min-w-[350px] max-w-[350px]')}>
        <TileWithImage
          title={{ value: 'LogoBrand', className: '!text-xl' }}
          url="https://source.boringavatars.com/marble/80"
          imageSize={{ width: 32, height: 32 }}
          className={tw('bg-white rounded-md px-6 py-4 !gap-x-2 !w-fit shadow-md')}
        />
        <div className={tw('flex flex-row grow justify-end')}>
          <Tile
            prefix={(<Helpwave size={64}/>)}
            title={{ value: 'helpwave', type: 'title', className: '!text-3xl' }}
            className={tw('text-white bg-hw-secondary-800 rounded-md px-4 py-1 !gap-x-2 !w-fit shadow-md')}
          />
        </div>
      </div>
    </div>
  )
}

type PlaceholderbrandInformationTranslation = {
  title: string,
  subTitle: string,
  closingText: string
}

const defaultPlaceholderbrandInformationTranslation: Record<Languages, PlaceholderbrandInformationTranslation> = {
  en: {
    title: 'This provides Information',
    subTitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    closingText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
  },
  de: {
    title: 'Das sind Informationen',
    subTitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    closingText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
  }
}

const PlaceholderbrandInformationSection = () => {
  const translation = useTranslation(defaultPlaceholderbrandInformationTranslation)
  return (
    <div
      className={tw('flex desktop:flex-row mobile:flex-wrap gap-8 desktop:justify-between mobile:justify-center w-full max-w-[1000px]')}>
      <div className={tw('max-w-[300px]')}>
        {/* TODO insert a graphic here */}
        <div className={tw('h-[150px] w-[300px] bg-gray-200 rounded-lg')}/>
      </div>
      <div className={tw('flex flex-col')}>
        <Span type="heading" className={tw('text-hw-secondary-400')}>{translation.title}</Span>
        <Span>{translation.subTitle}</Span>
        <ul className={tw('list-disc list-inside')}>
          <li>{'Point 1'}</li>
          <li>{'Point 2'}</li>
        </ul>
        <Span>{translation.closingText}</Span>
      </div>
    </div>
  )
}

type PlaceholderbrandBrandDescriptionTranslation = {
  titleBrand1: string,
  titleBrand2: string,
  subTitleBrand1: string,
  subTitleBrand2: string
}

const defaultPlaceholderbrandBrandDescriptionTranslation: Record<Languages, PlaceholderbrandBrandDescriptionTranslation> = {
  en: {
    titleBrand1: 'This provides Information',
    titleBrand2: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    subTitleBrand1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    subTitleBrand2: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam'
  },
  de: {
    titleBrand1: 'Das sind Informationen',
    titleBrand2: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    subTitleBrand1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    subTitleBrand2: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
  }
}
const PlaceholderbrandBrandDescriptionsSection = () => {
  const translation = useTranslation(defaultPlaceholderbrandBrandDescriptionTranslation)
  return (
    <div className={tw('flex flex-col gap-8 justify-center w-full max-w-[1000px]')}>
      <Tile
        title={{ value: translation.titleBrand1, type: 'title' }}
        description={{ value: translation.subTitleBrand1, type: 'normal' }}
        prefix={(
          <TileWithImage
            title={{ value: 'LogoBrand', className: '!text-xl' }}
            url="https://source.boringavatars.com/marble/80"
            imageSize={{ width: 64, height: 64 }}
            className={tw('!w-[300px]')}
          />
        )}
        className={tw('bg-white rounded-3xl px-6 py-16 !gap-x-2 !w-fit shadow-md')}
      />
      <Tile
        title={{ value: translation.titleBrand1, type: 'title' }}
        description={{ value: translation.subTitleBrand1, type: 'normal' }}
        prefix={(
          <Tile
            prefix={(<Helpwave size={64}/>)}
            title={{ value: 'helpwave', type: 'title', className: '!text-3xl' }}
            className={tw('text-white bg-hw-secondary-800 rounded-md px-4 py-1 !gap-x-2 !w-fit shadow-md')}
          />
        )}
        className={tw('text-white bg-hw-secondary-800 rounded-3xl px-6 py-16 !gap-x-2 !w-fit shadow-md')}
      />
    </div>
  )
}

type PlaceholderbrandContactTranslation = {
  title: string,
  subTitle: string
}

const defaultPlaceholderbrandContactTranslation: Record<Languages, PlaceholderbrandContactTranslation> = {
  en: {
    title: 'Contacts',
    subTitle: 'We are available to answer any questions you may have at short notice.',
  },
  de: {
    title: 'Ansprechepartner',
    subTitle: 'Wir stehen Ihnen bei jeglichen Fragen kurzfristig zur Verfügung.',
  }
}

const imageUrl = (key: string) => `https://cdn.helpwave.de/profile/${key}.png`

const contacts: ProfileProps[] = [
  {
    name: 'Christian Porschen',
    title: 'Dr. med.',
    role: 'Chief Medical Officer',
    roleBadge: 'CMO',
    imageUrl: imageUrl('christian_porschen'),
    tags: ['ai', 'science', 'doctor'],
    socials: [
      { type: 'linkedin', url: 'https://www.linkedin.com/in/cpors/' },
      { type: 'mail', url: 'mailto:christian.porschen@helpwave.de' },
      { type: 'github', url: 'https://github.com/aegis301' },
    ],
    imageSize: { width: 230 }
  },
  {
    name: 'Felix Evers',
    roleBadge: 'CEO',
    role: 'Chief Executive Officer',
    imageUrl: imageUrl('felix_evers'),
    tags: ['strategic', 'management', 'innovation'],
    socials: [
      { type: 'linkedin', url: 'https://www.linkedin.com/in/f-evers/' },
      { type: 'mail', url: 'mailto:felix.evers@helpwave.de' },
      { type: 'website', url: 'https://felixevers.de' },
      { type: 'github', url: 'https://github.com/use-to' },
    ],
    imageSize: { width: 230 }
  },
  {
    name: 'Max Schäfer',
    roleBadge: 'CTO',
    role: 'Chief Technology Officer',
    imageUrl: imageUrl('max_schaefer'),
    tags: ['development', 'cloud', 'scale'],
    socials: [
      { type: 'linkedin', url: 'https://www.linkedin.com/in/maxrobinschaefer/' },
      { type: 'mail', url: 'mailto:max.schaefer@helpwave.de' },
      { type: 'github', url: 'https://github.com/MaxSchaefer' },
    ],
    imageSize: { width: 230 }
  },
]

const PlaceholderbrandContactSection = () => {
  const translation = useTranslation(defaultPlaceholderbrandContactTranslation)
  return (
    <div className={tw('flex flex-col w-full max-w-[1000px]')}>
      <Span type="title" className={tw('text-hw-secondary-400 !text-3xl mb-1')}>{translation.title}</Span>
      <Span>{translation.subTitle}</Span>
      <div className={tw('flex flex-wrap desktop:justify-around mobile:justify-around gap-x-8 gap-y-6 mt-8')}>
        {contacts.map(value => (
          <Profile
            key={value.name}
            {...value}
            className={tx('drop-shadow-lg hover:drop-shadow-3xl border-1', value.className)}
          />
        ))}
      </div>
    </div>
  )
}

type PlaceholderbrandFAQTranslation = {
  title: string,
  subTitle: string
}

const defaultPlaceholderbrandFAQTranslation: Record<Languages, PlaceholderbrandFAQTranslation> = {
  en: {
    title: 'FAQ',
    subTitle: 'We are available to answer any questions you may have at short notice.',
  },
  de: {
    title: 'Häufige Fragen',
    subTitle: 'Wir stehen Ihnen bei jeglichen Fragen kurzfristig zur Verfügung.',
  }
}

const PlaceholderbrandFAQSection = () => {
  const translation = useTranslation(defaultPlaceholderbrandFAQTranslation)
  return (
    <div className={tw('flex flex-col w-full max-w-[1000px]')}>
      <Span type="title" className={tw('text-hw-secondary-400 !text-3xl mb-1')}>{translation.title}</Span>
      <Span>{translation.subTitle}</Span>
      <div className={tw('flex flex-col gap-y-4 mt-8')}>
        <FAQSection
          entries={[
            {
              id: 'Q1',
              title: 'Question 1',
              content: { value: 'Answer 1', type: 'markdown' }
            },
            {
              id: 'Q2',
              title: 'Question 2',
              content: { value: '\\positive{Answer 2}', type: 'markdown' }
            },
            {
              id: 'Q3',
              title: 'Question 3',
              content: { value: 'Answer 3', type: 'markdown' }
            },
            {
              id: 'Q4',
              title: 'Question 4',
              content: { value: '\\b{Answer 4}', type: 'markdown' }
            }
          ]}
          expandableClassName={tw('!py-4 !px-6')}
        />
      </div>
    </div>
  )
}

const PlaceholderbrandPage: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white relative z-0 overflow-x-hidden')}>
      <Header/>
      <div className={tw('w-full min-h-full pt-16')}>
        <div className={tw('flex flex-col w-full bg-gray-100 py-16 items-center px-16')}>
          <PlaceholderbrandHeaderSection/>
        </div>
        <div className={tw('flex flex-col w-full py-16 items-center px-16')}>
          <PlaceholderbrandInformationSection/>
        </div>
        <div className={tw('flex flex-col w-full py-16 bg-gray-100 items-center px-16')}>
          <PlaceholderbrandBrandDescriptionsSection/>
        </div>
        <div className={tw('flex flex-col w-full py-16 items-center px-16')}>
          <PlaceholderbrandContactSection/>
        </div>
        <div className={tw('flex flex-col w-full py-16 bg-gray-100 items-center px-16')}>
          <PlaceholderbrandFAQSection/>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default PlaceholderbrandPage
