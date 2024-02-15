import { tw } from '@helpwave/common/twind'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'

type StoryBlockProps = {
  pill?: string,
  header: string,
  content: string
}

type StoryTranslation = {
  healthcareSolutions: string,
  providingHealthcareSolutions: string,
  passionIsKey: string,
  passionIsKeyContent: string,
  atHelpwave: string
}

const defaultStoryTranslation: Record<Languages, StoryTranslation> = {
  en: {
    healthcareSolutions: 'Healthcare solutions',
    providingHealthcareSolutions: 'Providing healthcare solutions',
    passionIsKey: 'Passion is key for helpwave\'s vision!',
    passionIsKeyContent: 'Our commitment to maintaining the highest level of agility, much like what helpwave embodies, is driving'
      + ' unprecedented innovation across medical branches. Experience a healthcare software development like never'
      + ' before and join us on this transformative journey',
    atHelpwave: 'At helpwave, we\'re not just creating healthcare software; ' +
      'we\'re co-creating it with you, the end-users. By directly involving you in the process, ' +
      'we\'re elevating quality and nurturing stronger development relationships. ' +
      'This unique approach allows our dedicated developers and engineers to laser-focus ' +
      'on turning your requirements into innovative software features.'
  },
  de: {
    healthcareSolutions: 'Gesundheitslösungen',
    providingHealthcareSolutions: 'Gesundheitslösungen bereitstellen',
    passionIsKey: 'Leidenschaft ist der Schlüssel zur Vision von helpwave!',
    passionIsKeyContent: 'Unser Engagement, das höchste Maß an Agilität zu bewahren, ähnlich wie das, was helpwave verkörpert, treibt'
      + ' beispiellose Innovationen in medizinischen Zweigen voran. Erleben Sie eine Gesundheitssoftware-Entwicklung wie nie zuvor'
      + ' und begleiten Sie uns auf dieser transformierenden Reise',
    atHelpwave: 'Bei helpwave entwickeln wir nicht einfach nur Software für das Gesundheitswesen, ' +
      'sondern wir entwickeln sie gemeinsam mit unseren Kunden, den Endnutzern. ' +
      'Indem wir Sie direkt in den Prozess mit einbeziehen, steigern wir die Qualität und fördern eine engere Entwicklungsbeziehung. ' +
      'Dieser einzigartige Ansatz ermöglicht es unseren engagierten Entwicklern und Ingenieuren, ' +
      'sich voll und ganz auf die Umsetzung Ihrer Anforderungen in innovative Softwarefunktionen zu konzentrieren.'
  }
}

const StoryBlock = ({
  pill,
  header,
  content,
}: StoryBlockProps) => {
  return (
    <div className={tw('desktop:w-1/2')}>
      <div className={tw('flex flex-column h-[48px] items-end')}>
        {pill && <h4 className={tw('text-sm text-green-600 bg-green-100 px-3 py-0.5 font-semibold tracking-widest rounded-lg')}>{pill}</h4>}
      </div>
      <h2 className={tw('pt-4 text-4xl font-space font-bold')}>{header}</h2>
      <br/>
      <p className={tw('text-md')}>
        {content}
      </p>
    </div>
  )
}

const StorySection = ({ language }: PropsWithLanguage<StoryTranslation>) => {
  const translation = useTranslation(language, defaultStoryTranslation)

  return (
    <div className={tw('m-auto pb-16 pt-8 relative flex mobile:flex-wrap gap-16')}>
      <StoryBlock
        pill= {translation.healthcareSolutions}
        header={translation.providingHealthcareSolutions}
        content={translation.atHelpwave}
      />
      <StoryBlock
        header={translation.passionIsKey}
        content={translation.passionIsKeyContent}
      />
    </div>
  )
}

export default StorySection
