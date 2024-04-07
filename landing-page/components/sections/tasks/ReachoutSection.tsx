import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { MarkdownInterpreter } from '@helpwave/common/components/MarkdownInterpreter'

type ReachoutSectionTranslation = {
  medicalHeroTitle: string,
  medicalHeroSubtitle: string,
  medicalHeroText: string,
  hospitalManagerTitle: string,
  hospitalManagerSubtitle: string,
  hospitalManagerText: string
}

const defaultReachoutSectionTranslation: Record<Languages, ReachoutSectionTranslation> = {
  en: {
    medicalHeroTitle: `You're a medical hero?`,
    medicalHeroSubtitle: 'How \\helpwave \\primary{tasks} aims to aid you in your daily work!',
    medicalHeroText: `
      \\helpwave \\primary{tasks} is a modern kanban interface that helps you to coordinate your work and the work of your team. Note down your tasks for your patient for yourself and for your team.
      Standardize workflows by saving them as a template and share them with your new coworker for easy onboarding. Receive notifications about upcoming tasks and use our various dashboards for
      keeping track of patients and courses of treatment. \\helpwave \\primary{tasks} is the first open-source team management platform for healthcare workers.`,
    hospitalManagerTitle: `You're a hospital administrator?`,
    hospitalManagerSubtitle: 'How \\helpwave \\primary{tasks} can solve your issues!',
    hospitalManagerText: `
      \\helpwave \\primary{tasks} has been inspired by modern industry work flows and best practices from lean project management and applies them to the clinical environment.
      Keeping track of tasks and workflows in a clinical environment leads to better patient care and a more efficient use of resources.
      \\helpwave \\primary{tasks} can increase worker satisfaction and patient safety. Use it as a secure basis for your billing processes.
    `
  },
  de: {
    medicalHeroTitle: 'Du bist ein medical hero?\n',
    medicalHeroSubtitle: '\\helpwave \\primary{tasks} zielt darauf ab, dich bei deiner täglichen Arbeit zu unterstützen!',
    medicalHeroText: `
      \\helpwave \\primary{tasks} ist eine moderne Kanban-Schnittstelle, die dabei hilft, deine Arbeit die deines Teams zu koordinieren. Notiere dir deine Aufgaben für deinen Patienten für dich selbst und für dein Team.
      Standardisiere deine Workflows, indem du sie als Vorlage speicherst und mit deinen neuen Kollegen für ein einfaches Onboarding teilst. Erhalte Benachrichtigungen über bevorstehende Aufgaben und nutzen unsere verschiedenen Dashboards,
      um Patienten und deren Behandlungsverlauf zu verfolgen. \\helpwave \\primary{tasks} ist die erste Open-Source-Team-Management-Plattform für Mitarbeiter im Gesundheitswesen.
    `,
    hospitalManagerTitle: 'Du arbeitest in der Krankenhausverwaltung?',
    hospitalManagerSubtitle: 'Wie \\helpwave \\primary{tasks} deine Probleme auch hier lösen kann!',
    hospitalManagerText: `
      \\helpwave \\primary{tasks} wurde von modernen Arbeitsabläufen und Best.Practices aus dem Lean-Projektmanagement inspiriert und wendet diese Methodiken auf die klinische Umgebung an.
      Die Verfolgung von Aufgaben und Arbeitsabläufen in einem klinischen Umfeld führt zu einer besseren Patientenversorgung und einer effizienteren Nutzung von Ressourcen.
      \\helpwave \\primary{tasks} kann die Zufriedenheit der Mitarbeiter und die Patientensicherheit erhöhen. Du kannst \\helpwave \\primary{tasks} ausch als sichere Grundlage für deine Abrechnungsprozesse verwenden.
    `
  }
}

const ReachoutSection = ({ overwriteTranslation }: PropsForTranslation<ReachoutSectionTranslation>) => {
  const translation = useTranslation(defaultReachoutSectionTranslation, overwriteTranslation)

  return (
        <div className={tw('pt-32 pb-16 text-xl text-center')}>
            <h2 className={tw('font-space text-4xl font-bold')}>{translation.medicalHeroTitle}</h2>
            <h3 className={tw('font-sans text-1xl font-medium mt-2 mb-2 text-gray-600')}>
              <MarkdownInterpreter text={translation.medicalHeroSubtitle}/>
            </h3>
            <p className={tw('mb-5')}>
              <MarkdownInterpreter text={translation.medicalHeroText}/>
            </p>
            <h2 className={tw('font-space text-4xl font-bold')}>{translation.hospitalManagerTitle}</h2>
            <h3 className={tw('font-sans text-1xl font-medium mt-2 mb-2 text-gray-600')}>
              <MarkdownInterpreter text={translation.hospitalManagerSubtitle}/>
            </h3>
            <p>
              <MarkdownInterpreter text={translation.hospitalManagerText}/>
            </p>
        </div>
  )
}

export default ReachoutSection
