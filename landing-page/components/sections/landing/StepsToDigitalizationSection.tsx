import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Span } from '@helpwave/common/components/Span'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'
import { TextImage } from '@helpwave/common/components/TextImage'
import { Carousel } from '@helpwave/common/components/layout/Carousel'
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
  step3Description: string
}

const defaultStepsToDigitalizationSectionTranslation: Record<Languages, StepsToDigitalizationSectionTranslation> = {
  en: {
    // TODO update
    title: '\\secondary{Digital exelence} in\\newline 3 simple steps',
    description: 'Our approach is to implement more efficient and fun\\newline processes in a simple yet powerful way.',
    step: 'Step',
    step1Title: 'Identifying the problem',
    step1Description: 'helpwave was born out of a simple question: How can we leverage our software expertise to support healthcare professionals? We have all encountered outdated, clunky software in our daily work, and have observed its impact on patient care and our own lives. Despite significant investments, current solutions often fall short. This is where helpwave steps in. We are committed to providing healthcare heroes with efficient, affordable tools, empowering hospitals to regain control over their infrastructure and data. By providing seamless access to vital information, we aim to enhance patient care and ease the burden on healthcare workers.',
    step2Title: 'helpwave tasks and the Open Innovation Concept',
    step2Description: 'helpwave is passionate about supporting those who dedicate their lives to patient care. We have developed helpwave tasks, a tool designed to simplify the lives of healthcare workers, integrating lean project management principles into healthcare teams. We collaborate closely with doctors, nurses, students, and administrators to enhance team organization, communication, and task management. At helpwave, we champion Open Innovation and Open Source principles, ensuring that our software is not only user-friendly but also community-driven and transparent. Join us in revolutionizing healthcare software, designed by healthcare workers, for healthcare workers.',
    step3Title: 'The Future of helpwave',
    step3Description: 'Drawing from our experience developing helpwave tasks, we have identified a critical issue in the healthcare software landscape: Deployment is a nightmare. Hospital IT infrastructure is often unreliable, outdated, and insecure, burdened by interoperability gaps and regulatory hurdles that favor large players. Enter helpwave: We are developing a platform to streamline software deployment in healthcare, empowering hospitals with control over their infrastructure and data. Our innovative technology is not just laying the groundwork for healthcare digitization, it is also democratizing market entry for new players, embodying the essence of Open Innovation. Join us at the table to revolutionize healthcare together.'
  },
  de: {
    // TODO update
    title: '\\secondary{Digitale Exelenz} in\\newline 3 Schritten',
    description: 'Unser Ansatz ist es, effizientere Prozesse zu implementieren, die Spaß machen\\newline - und das auf einfache, aber wirkungsvolle Weise.',
    step: 'Step',
    step1Title: 'Lorem ipsum dolor sit ame',
    step1Description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur',
    step2Title: 'Lorem ipsum dolor sit ame',
    step2Description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur',
    step3Title: 'Lorem ipsum dolor sit ame',
    step3Description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur'
  }
}

/**
 * A Section for showing steps need for Digitalization
 */
export const StepsToDigitalizationSection = () => {
  const translation = useTranslation(defaultStepsToDigitalizationSectionTranslation)

  return (
    <SectionBase className={tw('flex flex-col gap-y-8 w-full')}>
      <div className={tw('flex flex-col items-center text-center gap-y-2')}>
        <h2><Span type="title" className={tw('!text-3xl')}><MarkdownInterpreter text={translation.title}/></Span></h2>
        <Span className={tw('font-space font-semibold')}><MarkdownInterpreter text={translation.description}/></Span>
      </div>
      <Carousel>
        <TextImage
          badge={`${translation.step} #1`}
          title={translation.step1Title}
          description={translation.step1Description}
          imageUrl="https://cdn.helpwave.de/partners/mshack_2023.png"
          color="primary"
        />
        <TextImage
          badge={`${translation.step} #2`}
          title={translation.step2Title}
          description={translation.step2Description}
          imageUrl="https://cdn.helpwave.de/partners/mshack_2023.png"
          color="secondary"
        />
        <TextImage
          badge={`${translation.step} #3`}
          title={translation.step3Title}
          description={translation.step3Description}
          imageUrl="https://cdn.helpwave.de/partners/mshack_2023.png"
          color="secondaryDark"
        />
      </Carousel>
    </SectionBase>
  )
}
