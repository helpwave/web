import { type Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import clsx from 'clsx'
import { SectionBase } from '@/components/sections/SectionBase'

type RoadmapItem = {
  name: string,
  start: string,
  description: string,
}

type RoadmapTranslation = {
  title: string,
  description: string,
  roadmap: RoadmapItem[],
}

const defaultRoadmapTranslation: Record<Languages, RoadmapTranslation> = {
  en: {
    title: 'What\'s next?',
    description: 'Dive into how helpwave pursues the mediQuu vision.',
    roadmap: [
      {
        name: 'helpwave tasks',
        description: 'Increase the productivity of your clinical team with helpwave tasks, a modern Kanban interface that applies Lean project management methodologies to the clinical environment.',
        start: 'Adaptation from Q2.2024',
      },
      {
        name: 'mediQuu Viva',
        description: 'A process-oriented software for patients and healthcare providers, enabling seamless and secure communication, including encrypted requests, chat function, and automatic appointment reminders.',
        start: 'Development from Q3.2024',
      },
      {
        name: 'App zum Doc',
        description: 'The App zum Doc relieves staff in medical practices by providing structured and digital requests for prescriptions and referrals.',
        start: 'Expansion from Q3.2024',
      },
      {
        name: 'helpwave call',
        description: 'This software offers a comprehensive solution for outpatient and inpatient services, enabling seamless and simple telemedicine communication conveniently from anywhere.',
        start: 'New development from Q4.2024',
      },
      {
        name: 'helpwave cloud',
        description: 'Secure your data in a safe server environment on-site and enhance access to it for yourself and your patients.',
        start: 'Adaptation from Q1.2025',
      },
    ],
  },
  de: {
    title: 'Was passiert als nächstes?',
    description: 'Erkunden Sie, wie helpwave die Vision von mediQuu weiterführen wird.',
    roadmap: [
      {
        name: 'helpwave tasks',
        description: 'Erhöhe die Produktivität deines klinischen Teams mit helpwave tasks, einem modernen Kanban-Interface, das Lean-Projektmanagement-Methodiken auf die klinische Umgebung anwendet.',
        start: 'Adaption ab Q2.2024',
      },
      {
        name: 'mediQuu Viva',
        description: 'Weiterentwicklung einer arzt-geführten Fallakte für eine chronologische Dokumentation von Behandlungen und Versorgungsleistungen mit einer Integration für bestimmte Praxisverwaltungssysteme.',
        start: 'Entwicklung ab Q3.2024',
      },
      {
        name: 'App zum Doc',
        description: 'Die App zum Doc entlastet Mitarbeiterinnen in Arztpraxen durch strukturierte und digitale Anfragen für Rezepte und Überweisungen. Die Option Videosprechstunden via App durchzuführen ist in Planung.',
        start: 'Ausbau ab Q3.2024',
      },
      {
        name: 'helpwave call',
        description: 'Diese Software bietet eine umfassende Lösung für ambulante und stationäre Dienste, die nahtlose und einfache Telemedizin-Kommunikation bequem und von überall aus ermöglicht.',
        start: 'Neuentwicklung ab Q4.2024',
      },
      {
        name: 'helpwave cloud',
        description: 'Speichern Sie Ihre Daten in einer sicheren Serverumgebung vor Ort und verbessern Sie den Zugriff darauf für sich selbst und Ihre Patienten.',
        start: 'Adaption ab Q1.2025',
      },
    ],
  }
}

export const RoadmapSection = () => {
  const translation = useTranslation(defaultRoadmapTranslation)
  return (
    <SectionBase  className={clsx('col')}>
      <span className={clsx('textstyle-title-lg text-primary mb-1')}>{translation.title}</span>
      <span className={clsx('textstyle-description mb-1')}>{translation.description}</span>
      <div className={clsx('mt-4 w-full flex flex-wrap justify-start gap-4')}>
        {translation.roadmap.map(value => (
          <div key={value.name} className={clsx('w-full desktop:max-w-[300px] bg-surface text-on-surface shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow transition-1000')}>
            <span className={clsx('textstyle-title-normal block')}>{value.name}</span>
            <span className={clsx('textstyle-label-sm block text-secondary dark:text-primary mb-2')}>{value.start}</span>
            <span className={clsx('text-description')}>{value.description}</span>
          </div>
        ))}
      </div>
    </SectionBase>
  )
}
