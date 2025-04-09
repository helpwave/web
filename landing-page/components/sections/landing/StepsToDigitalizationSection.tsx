import clsx from 'clsx'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import type { TextImageProps } from '@helpwave/common/components/TextImage'
import { TextImage } from '@helpwave/common/components/TextImage'
import { Carousel } from '@helpwave/common/components/layout/Carousel'
import { useState } from 'react'
import { Modal } from '@helpwave/common/components/modals/Modal'
import Scrollbars from 'react-custom-scrollbars-2'
import { SectionBase } from '@/components/sections/SectionBase'

type StepsToDigitalizationSectionTranslation = {
  title: string,
  description: string,
  step: string,
  step1Title: string,
  step1Description: string,
  step2Title: string,
  step2Description: string,
  step3Title: string,
  step3Description: string,
}

const defaultStepsToDigitalizationSectionTranslation: Record<Languages, StepsToDigitalizationSectionTranslation> = {
  en: {
    title: '\\secondary{Digital excellence} in\\newline 3 simple steps',
    description: 'Our approach is to implement more efficient and fun\\newline processes in a simple yet powerful way.',
    step: 'Step',
    step1Title: 'Define the mission',
    step1Description: 'At helpwave we are committed to driving unprecedented innovation. We believe in improving patient care by developing cutting-edge software in all areas of patient care.',
    step2Title: 'Apply Open Innovation',
    step2Description: 'We believe in the open source approach to ensure the highest quality work product. This unique approach allows our dedicated development team to focus on translating your requirements into innovative software features.',
    step3Title: 'Aim for disruption',
    step3Description: 'Regulatory burdens and high entry barriers make it difficult for small companies to enter the market, leading to a lack of competition. helpwave is here to change that. We provide a platform that invites everyone to the table, not just only the big players.'
  },
  de: {
    title: '\\secondary{Digitale Exelenz} in\\newline 3 Schritten',
    description: 'Unser Ansatz ist es, effizientere Prozesse zu implementieren, die Spaß machen\\newline - und das auf einfache, aber wirkungsvolle Weise.',
    step: 'Step',
    step1Title: 'Definieren Sie die Mission', // TODO update
    step1Description: 'Bei helpwave haben wir uns verpflichtet, beispiellose Innovationen voranzutreiben. Wir glauben an die Verbesserung der Patientenversorgung durch die Entwicklung innovativer Software in allen Bereichen der Patientenversorgung.',
    step2Title: 'Offene Innovation anwenden',
    step2Description: 'Wir glauben an den Open-Source-Ansatz, um die höchste Qualität des Arbeitsprodukts zu gewährleisten. Dieser einzigartige Ansatz ermöglicht es unserem engagierten Entwicklungsteam, sich auf die Umsetzung der Nutzer-Anforderungen in innovative Softwarefunktionen zu konzentrieren.',
    step3Title: 'Disruption anstreben',
    step3Description: 'Regulatorische Belastungen und hohe Eintrittsbarrieren erschweren den Markteintritt für kleine Unternehmen und führen zu mangelndem Wettbewerb. helpwave wird das ändern. Wir bieten eine Plattform, die jeden an den Tisch holt, nicht nur die großen Player.'
  }
}

/**
 * A Section for showing steps need for Digitalization
 */
export const StepsToDigitalizationSection = () => {
  const translation = useTranslation(defaultStepsToDigitalizationSectionTranslation)
  const [modalValue, setModalValue] = useState<{ titleText: string, description: string }>()

  const items: TextImageProps[] = [
    {
      badge: `${translation.step} #1`,
      title: translation.step1Title,
      description: translation.step1Description,
      // make attribution https://www.freepik.com/free-photo/doctors-looking-laptop-while-sitting_5480800.htm#fromView=search&page=1&position=38&uuid=4c39262c-c1b1-4f11-a15e-7446ad1974d3
      imageUrl: 'https://cdn.helpwave.de/landing_page/doctors_discussing.jpg',
      color: 'primary',
      onShowMoreClicked: () => setModalValue({
        titleText: translation.step1Title,
        description: translation.step1Description
      })
    },
    {
      badge: `${translation.step} #2`,
      title: translation.step2Title,
      description: translation.step2Description,
      // make attribution https://www.freepik.com/free-photo/wide-shot-huge-tree-trunk-near-lake-surrounded-by-trees-blue-sky_7841618.htm#fromView=search&page=1&position=0&uuid=0752105f-3120-4f34-b3b7-48dd4a616223
      imageUrl: 'https://cdn.helpwave.de/landing_page/lake.jpg',
      color: 'secondary',
      onShowMoreClicked: () => setModalValue({
        titleText: translation.step2Title,
        description: translation.step2Description
      })
    },
    {
      badge: `${translation.step} #3`,
      title: translation.step3Title,
      description: translation.step3Description,
      // make attribution https://www.freepik.com/free-vector/infographic-dashboard-element-set_6209714.htm#fromView=search&page=1&position=45&uuid=12db1ee2-bec5-40ce-a317-5d240ad56f12
      imageUrl: 'https://cdn.helpwave.de/landing_page/dashboard.jpg',
      color: 'dark',
      onShowMoreClicked: () => setModalValue({
        titleText: translation.step3Title,
        description: translation.step3Description
      })
    },
  ]

  return (
    <SectionBase className={clsx('flex flex-col gap-y-8 w-full !max-w-[1600px]')} outerClassName={clsx('!px-0')}>
      <div className={clsx('flex flex-col items-center text-center gap-y-2')}>
        <h2 className={clsx('textstyle-title-xl')}><MarkdownInterpreter text={translation.title}/></h2>
        <span className={clsx('textstyle-title-sm')}><MarkdownInterpreter text={translation.description}/></span>
      </div>
      <Carousel hintNext={true} isLooping={true} isAutoLooping={true} heights={{ tablet: 300 }} blurColor="from-gray-50">
        {items.map((value, index) => (
          <div key={index} className={clsx('px-[2.5%] h-full')}>
            <TextImage {...value} className={clsx('h-full overflow-hidden')}/>
          </div>
        ))}
      </Carousel>
      <Modal
        id="stepsToDigitizationModal"
        isOpen={modalValue !== undefined}
        titleText={modalValue?.titleText}
        description={(
          <Scrollbars autoHeightMax={500} autoHeight={true}>
            {modalValue?.description}
          </Scrollbars>
        )}
        onBackgroundClick={() => setModalValue(undefined)}
        onCloseClick={() => setModalValue(undefined)}
        modalClassName={clsx('max-w-[600px] mobile:max-w-[90%] w-full')}
      />
    </SectionBase>
  )
}
