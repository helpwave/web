import { tw } from '@helpwave/style-themes/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { SectionBase } from '@/components/sections/SectionBase'

type StoryBlockProps = {
  pill?: string,
  header: string,
  content: string,
}

const StoryBlock = ({
  pill,
  header,
  content,
}: StoryBlockProps) => {
  return (
    <div className={tw('w-2/3 mobile:w-full tablet:w-full')}>
      <div className={tw('flex flex-col items-start')}>
        {pill && <h4 className={tw('text-sm text-green-600 bg-green-100 px-3 py-0.5 font-semibold tracking-widest rounded-lg')}>{pill}</h4>}
      </div>
      <h2 className={tw('pt-4 text-4xl font-space font-bold')}>{header}</h2>
      <br />
      <p className={tw('text-md')}>
        {content}
      </p>
    </div>
  )
}

type StoryTranslation = {
  innovation: string,
  innovationHeader: string,
  innovationDescription: string,
  disruption: string,
  disruptionHeader: string,
  disruptionDescription: string,
  mission: string,
  missionHeader: string,
  missionDescription: string,
}

const defaultStoryTranslation: Record<Languages, StoryTranslation> = {
  en: {
    innovation: 'Open Innovation',
    innovationHeader: 'Providing healthcare solutions',
    innovationDescription: "At helpwave, we're not just creating healthcare software; we're co-creating it with you, the " +
      "end-users. By directly involving you in the process, we're elevating quality and nurturing stronger " +
      'development relationships. This unique approach allows our dedicated developers and engineers to laser-focus' +
      'on turning your requirements into innovative software features.',
    disruption: 'Disruption',
    disruptionHeader: 'Access for everyone',
    disruptionDescription: 'When did you last feel like the software you\'re using is worth billions? We didn\'t think so. ' +
      'Regulatory overhead and high entry barriers are making it hard for small companies to enter the market which leads to a lack of competition.' +
      'helpwave is here to change that. We are providing a platform that invites everyone to the table, not just only the big players.',
    mission: 'Our mission',
    missionHeader: 'Passion for our vision',
    missionDescription: 'Our commitment to maintaining the highest level of agility, much like what helpwave embodies, is driving ' +
      'unprecedented innovation across medical branches. Experience a healthcare software development like never ' +
      'before and join us on this transformative journey',
  },
  de: {
    innovation: 'Offene Innovation',
    innovationHeader: 'Lösungen für das Gesundheitswesen',
    innovationDescription: 'Bei helpwave entwickeln wir nicht einfach nur Software für das Gesundheitswesen, sondern wir ' +
      'entwickeln sie gemeinsam mit Ihnen, den Endnutzern. Indem wir Sie direkt in den Prozess einbeziehen, steigern wir ' +
      'die Qualität und fördern eine engere Entwicklungsbeziehung. Dieser einzigartige Ansatz ermöglicht es unseren ' +
      'engagierten Entwicklern und Ingenieuren, sich voll und ganz auf die Umsetzung Ihrer Anforderungen in innovative ' +
      'Softwarefunktionen zu konzentrieren.',
    disruption: 'Disruption',
    disruptionHeader: 'Zugriff für alle',
    disruptionDescription: 'Wann hatten Sie zuletzt das Gefühl, dass die Software, die Sie verwenden, Milliarden wert ist? ' +
      'Wahrscheinlich nie. Regulatorischer Aufwand und hohe Eintrittsbarrieren machen es kleinen Unternehmen ' +
      'schwer, in den Markt einzutreten, was zu einem Mangel an Wettbewerb führt. helpwave ist hier, um das zu ändern. ' +
      'Wir bieten eine Plattform, die alle an einen Tisch bringt, nicht nur die großen Unternehmen.',
    mission: 'Unsere Mission',
    missionHeader: 'Passion für unsere Vision',
    missionDescription: 'Unser Engagement für ein Höchstmaß an Agilität, wie es helpwave verkörpert, treibt beispiellose ' +
      'Innovationen in allen medizinischen Bereichen voran. Erleben Sie eine Softwareentwicklung im Gesundheitswesen ' +
      'wie nie zuvor und begleiten Sie uns auf dieser transformativen Reise.',
  }
}

const StorySection = ({ overwriteTranslation }: PropsForTranslation<StoryTranslation>) => {
  const translation = useTranslation(defaultStoryTranslation, overwriteTranslation)
  return (
    <SectionBase className={tw('flex tablet:flex-wrap mobile:flex-wrap w-full relative gap-16')} backgroundColor="gray">
      <StoryBlock
        pill={translation.innovation}
        header={translation.innovationHeader}
        content={translation.innovationDescription}
      />
      <StoryBlock
        pill={translation.disruption}
        header={translation.disruptionHeader}
        content={translation.disruptionDescription}
      />
      <StoryBlock
        pill={translation.mission}
        header={translation.missionHeader}
        content={translation.missionDescription}
      />
    </SectionBase>
  )
}

export default StorySection
