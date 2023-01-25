import { forwardRef } from 'react'
import { Section } from '../Section'
import { tw, tx } from '@twind/core'
import { Checkbox } from '../Checkbox'

const featuresDe = [
  { title: 'Intuitiv', detail: 'Keine Einarbeitung, keine Handbücher. Anmelden, loslegen. Sicher durch den Klinikalltag und pünktlicher in den Feierabend. Mehr Zeit für die Dinge auf die es ankommt.' },
  { title: 'Kollaborativ', detail: 'Kein Telefon mehr, erst Recht kein Faxgerät. Einfache Teamorganisation auf einer gemeinsamen Plattform. Teilbare SOPs über das gesamte Team. Egal von wo, egal wann.' },
  { title: 'Praxisnah', detail: 'Echte Lösungen für echte Menschen. Entwickelt mit dem Personal vor Ort um ihnen die Lösungen zu liefern die sie immer wollten, aber nie bekommen haben.' },
  { title: 'Sicherheit', detail: 'Standardisiertes Arbeiten. Kein Vergessen mehr von Aufgaben. Kein Verlieren der Stationsliste. Mehr Sicherheit für Patient:innen, ein besseres Gefühl für Mitarbeitende.' },
]

const featuresEn = [
  { title: 'Intuitive', detail: 'No training, no manuals. Sign up, get started. Safely through the clinical every day and less overtime. More time for the things that matter.' },
  { title: 'Collaborative', detail: 'No more phone calls, no fax machines. Easy to use team organization on a single platform. Shareable SOPs across the entire team. No matter where, no matter when.' },
  { title: 'Real Life', detail: 'Real solutions for real people. Developed with the staff on site to give them the solutions they always wanted, but never got.' },
  { title: 'Security', detail: "Standardized work. No more forgetting tasks. No more losing the ward's list. More security for patients, a better feeling for the staff." },
]

const Feature = ({ title, detail }: { title: string, detail: string }) => (
  <div className={tw('flex flex-row items-start text-xl')}>
    <Checkbox checked={true} onChange={() => undefined} disabled id={`feature-${title}`} label="" />
    <span className={tw('font-medium text-white text-xl')}>
      {title} <span className={tw(`font-normal text-gray-400`)}>{detail}</span>
    </span>
  </div>
)

const FeaturesSection = forwardRef<HTMLDivElement>(function FeaturesSection(_, ref) {
  return (
    <div className={tw('relative')} id="features">
      <Section ref={ref} id="features">
        <h1 className={tw('text-5xl font-space font-bold pb-4')}>Solve real world problems</h1>
        <div className={tw('w-5/12 flex flex-col my-24')}>
          {featuresDe.map((value, index) => (
            <div key={index} className={tx('w-9/12 flex flex-col my-8', {
              'self-end mr-8': index % 2 === 0,
              'self-start ml-8': index % 2 === 1
            })}>
              <Feature {...value} />
            </div>
          ))}
        </div>
      </Section>
      <div
        className={tw('w-6/12 h-full flex flex-col absolute right-0 top-0 rounded-3xl pb-16 pt-32')}
        style={{ background: 'radial-gradient(#6F387999 15%, #281c2000 60%)' }}
      >
        <div className={tw('w-full h-3/6 flex flex-row items-end justify-end mb-8')}>
          <div className={tw('w-3/5 h-4/5 relative rounded-3xl bg-gray-200')}/>
          <div className={tw('w-3/12 h-full rounded-l-3xl ml-8 mt-4 bg-gray-200')}/>
        </div>
        <div className={tw('w-full h-3/6 flex justify-end')}>
          <div className={tw('w-9/12 h-5/6 rounded-l-3xl bg-gray-200')}/>
        </div>
      </div>
    </div>
  )
})

export default FeaturesSection
