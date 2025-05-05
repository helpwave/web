import { clsx } from 'clsx'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { TextImageProps } from '@helpwave/common/components/TextImage'
import { TextImage } from '@helpwave/common/components/TextImage'
import { Carousel } from '@helpwave/common/components/layout/Carousel'
import { useState } from 'react'
import { Modal } from '@helpwave/common/components/modals/Modal'
import Scrollbars from 'react-custom-scrollbars-2'
import { SectionBase } from '@/components/sections/SectionBase'

type StorySliderSectionTranslation = {
  chip1: string,
  chip2: string,
  chip3: string,
  title1: string,
  title2: string,
  title3: string,
  description1: string,
  description2: string,
  description3: string,
}

const defaultStorySliderSectionTranslation: Record<Languages, StorySliderSectionTranslation> = {
  en: {
    chip1: 'Our Approach',
    chip2: 'Collaborative',
    chip3: 'Goal',
    title1: 'Identifying the problem',
    title2: 'helpwave tasks and the Open Innovation Concept',
    title3: 'The Future of helpwave',
    description1: 'helpwave was born out of a simple question: How can we leverage our software expertise to support healthcare professionals? We have all encountered outdated, clunky software in our daily work, and have observed its impact on patient care and our own lives. Despite significant investments, current solutions often fall short. This is where helpwave steps in. We are committed to providing healthcare heroes with efficient, affordable tools, empowering hospitals to regain control over their infrastructure and data. By providing seamless access to vital information, we aim to enhance patient care and ease the burden on healthcare workers.',
    description2: 'helpwave is passionate about supporting those who dedicate their lives to patient care. We have developed helpwave tasks, a tool designed to simplify the lives of healthcare workers, integrating lean project management principles into healthcare teams. We collaborate closely with doctors, nurses, students, and administrators to enhance team organization, communication, and task management. At helpwave, we champion Open Innovation and Open Source principles, ensuring that our software is not only user-friendly but also community-driven and transparent. Join us in revolutionizing healthcare software, designed by healthcare workers, for healthcare workers.',
    description3: 'Drawing from our experience developing helpwave tasks, we have identified a critical issue in the healthcare software landscape: Deployment is a nightmare. Hospital IT infrastructure is often unreliable, outdated, and insecure, burdened by interoperability gaps and regulatory hurdles that favor large players. Enter helpwave: We are developing a platform to streamline software deployment in healthcare, empowering hospitals with control over their infrastructure and data. Our innovative technology is not just laying the groundwork for healthcare digitization, it is also democratizing market entry for new players, embodying the essence of Open Innovation. Join us at the table to revolutionize healthcare together.'
  },
  de: {
    chip1: 'Unser Ansatz',
    chip2: 'Zusammenarbeit',
    chip3: 'Ziel',
    title1: 'Erkennen des Problems',
    title2: 'helpwave tasks und das Open-Innovation-Konzept',
    title3: 'Die Zukunft von helpwave',
    description1: 'helpwave wurde aus einer einfachen Frage heraus geboren: Wie können wir unser Software-Know-how nutzen, um Fachkräfte im Gesundheitswesen zu unterstützen? Wir alle sind bei unserer täglichen Arbeit mit veralteter, klobiger Software konfrontiert und haben deren Auswirkungen auf die Patientenversorgung und unser eigenes Leben beobachtet. Trotz erheblicher Investitionen sind die derzeitigen Lösungen oft unzureichend. An dieser Stelle kommt helpwave ins Spiel. Wir haben es uns zur Aufgabe gemacht, die Helden des Gesundheitswesens mit effizienten, erschwinglichen Tools auszustatten, die es den Krankenhäusern ermöglichen, die Kontrolle über ihre Infrastruktur und Daten zurückzugewinnen. Durch die Bereitstellung eines nahtlosen Zugriffs auf wichtige Informationen wollen wir die Patientenversorgung verbessern und die Mitarbeiter im Gesundheitswesen entlasten.',
    description2: 'helpwave hat es sich zur Aufgabe gemacht, diejenigen zu unterstützen, die ihr Leben der Patientenversorgung widmen. Wir haben helpwave tasks entwickelt, ein Tool, das das Leben der Mitarbeiter im Gesundheitswesen vereinfachen soll, indem es die Prinzipien des schlanken Projektmanagements in Teams im Gesundheitswesen integriert. Wir arbeiten eng mit Ärzten, Krankenschwestern, Studenten und Verwaltungsangestellten zusammen, um die Teamorganisation, die Kommunikation und das Aufgabenmanagement zu verbessern. Bei helpwave setzen wir uns für Open-Innovation- und Open-Source-Prinzipien ein, um sicherzustellen, dass unsere Software nicht nur benutzerfreundlich, sondern auch Community-gesteuert und transparent ist. Helfen Sie uns dabei, Software für das Gesundheitswesen zu revolutionieren - entwickelt von Mitarbeitern im Gesundheitswesen für Mitarbeiter im Gesundheitswesen.',
    description3: 'Ausgehend von unserer Erfahrung bei der Entwicklung von helpwave tasks haben wir ein kritisches Problem in der Softwarelandschaft des Gesundheitswesens erkannt: Die Bereitstellung ist ein Albtraum. Die IT-Infrastruktur in Krankenhäusern ist oft unzuverlässig, veraltet und unsicher, belastet durch Interoperabilitätslücken und regulatorische Hürden, wodurch große Anbieter bevorzugt werden. Hier kommt helpwave ins Spiel: Wir entwickeln eine Plattform zur Straffung der Softwarebereitstellung im Gesundheitswesen, die den Krankenhäusern die Kontrolle über ihre Infrastruktur und Daten gibt. Unsere innovative Technologie legt nicht nur den Grundstein für die Digitalisierung des Gesundheitswesens, sondern demokratisiert auch den Markteintritt neuer Akteure und verkörpert damit die Essenz der Open-Innovation. Setzen Sie sich mit uns an einen Tisch, um das Gesundheitswesen gemeinsam zu revolutionieren.',
  }
}

/**
 * A Section for showing a slider on the story page
 */
export const StorySliderSection = () => {
  const translation = useTranslation(defaultStorySliderSectionTranslation)
  const [modalValue, setModalValue] = useState<{ titleText: string, description: string }>()

  const items: TextImageProps[] = [
    {
      badge: translation.chip1,
      title: translation.title1,
      description: translation.description1,
      // make attribution https://www.freepik.com/free-photo/doctors-looking-laptop-while-sitting_5480800.htm#fromView=search&page=1&position=38&uuid=4c39262c-c1b1-4f11-a15e-7446ad1974d3
      imageUrl: 'https://cdn.helpwave.de/landing_page/doctors_discussing.jpg',
      color: 'primary',
      onShowMoreClicked: () => setModalValue({
        titleText: translation.title1,
        description: translation.description1
      })
    },
    {
      badge: translation.chip2,
      title: translation.title2,
      description: translation.description2,
      // make attribution https://www.freepik.com/free-photo/wide-shot-huge-tree-trunk-near-lake-surrounded-by-trees-blue-sky_7841618.htm#fromView=search&page=1&position=0&uuid=0752105f-3120-4f34-b3b7-48dd4a616223
      imageUrl: 'https://cdn.helpwave.de/landing_page/lake.jpg',
      color: 'secondary',
      onShowMoreClicked: () => setModalValue({
        titleText: translation.title2,
        description: translation.description2
      })
    },
    {
      badge: translation.chip3,
      title: translation.title3,
      description: translation.description3,
      // make attribution https://www.freepik.com/free-vector/infographic-dashboard-element-set_6209714.htm#fromView=search&page=1&position=45&uuid=12db1ee2-bec5-40ce-a317-5d240ad56f12
      imageUrl: 'https://cdn.helpwave.de/landing_page/dashboard.jpg',
      color: 'dark',
      onShowMoreClicked: () => setModalValue({
        titleText: translation.title3,
        description: translation.description3
      })
    },
  ]

  return (
    <SectionBase className={clsx('col gap-y-8 w-full !max-w-[1600px]')} outerClassName={clsx('!px-0')}>
      <Carousel hintNext={true} isLooping={true} isAutoLooping={true} autoLoopingTimeOut={15000} blurColor="from-gray-50">
        {items.map((value, index) => (
          <div key={index} className={clsx('px-[2.5%] h-full')}>
            <TextImage {...value} className={clsx('h-full overflow-hidden')}/>
          </div>
        ))}
      </Carousel>
      <Modal
        id="storiesSliderModal"
        isOpen={modalValue !== undefined}
        titleText={modalValue?.titleText}
        description={(
          <Scrollbars autoHeightMax={500} autoHeight={true}>
            {modalValue?.description}
          </Scrollbars>
        )}
        onBackgroundClick={() => setModalValue(undefined)}
        onCloseClick={() => setModalValue(undefined)}
        modalClassName={clsx('max-w-[600px] max-tablet:max-w-[90%] w-full')}
      />
    </SectionBase>
  )
}
