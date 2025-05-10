import { Popcorn } from 'lucide-react'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { SectionBase } from '@/components/sections/SectionBase'

type StoryStartSectionTranslation = {
  ourStory: string,
  identifyingTheProblemTitle: string,
  identifyingTheProblemText: string,
  tasksAndOpenInnovationTitle: string,
  tasksAndOpenInnovationText: string,
  futureTitle: string,
  futureText: string,
}

const defaultStoryStartSectionTranslation: Record<Languages, StoryStartSectionTranslation> = {
  en: {
    ourStory: 'Our Story',
    identifyingTheProblemTitle: 'Identifying the Problem',
    identifyingTheProblemText: `
      helpwave emerged from a simple problem: how can we use our knowledge on software and digital tools to make the lifes of healthcare workers easier? And what is software currently used in the healthcare system lacking? All of us who work at the frontline of healthcare have experienced the frustration of outdated, inefficient, and non-intuitive software. We have seen the consequences of this in our daily work, and we have seen the consequences of this in the lives of our patients and the consequences on our lifes, too!
      The even more frustrating part: Hospitals spend millions of their budget on tools that are inefficient and make our lifes harder. The global healthcare software as a service market size was valued around 28 billion USD in 2022, with an expected growth to over 75 billion USD in the next ten years alone. Well, you guys work in the healthcare system, when did you last feel like the software you're using is worth billions? We didn't think so.
      helpwave wants to do things differently: Delivering the software to healthcare heros that they deserve. Great tools that don't bleed out the hosptials budget. Giving control back to the hospitals over their infrastructure and their data. Enabling researchers to access data to improve patient care. And most importantly: Making the lifes of healthcare workers easier.
    `,
    tasksAndOpenInnovationTitle: 'helpwave tasks and the Open Innovation Concept',
    tasksAndOpenInnovationText: `
      Enthusiastic as we were for the people that dedicate their lifes to patient care, we wanted to go directly to the frontlines: With helpwave tasks we developed a tool that is designed to make the lifes of healthcare workers easier. Bringing modern concepts of lean project management into healthcare teams and enabling healthcare workers to fill a gap that their current set of tools does not cover. We wanted to make sure that helpwave tasks is not just another tool that is used in the healthcare system, but a tool that is loved by the people that use it.
      So we brought together designers, developers and visionaries with the people of the front line: doctors, nurses, students, researchers and administrators. We wanted to give them a tool that enables them to better organize their work, to communicate more efficiently and to have a better overview of their tasks. We wanted to give them a tool that is easy to use, that is intuitive and just plain fun!
      At helpwave, software development does not happen in a top down approach. Healthcare workers are part of the discussion from the very beginning. Every step of the way is reviewed by real healthcare workers with years of experience from different fields. Feature requests and suggestions come directly from the wards, operating rooms and research labs of our community.
      helpwave is an Open Innovation and Open Source company. What does that mean? Well, we believe that the best ideas come from the people that are directly affected by the problems we are trying to solve. And we believe that in a healthcare system that is built on the idea of sharing knowledge and experience, software should be no different. So we are committed to sharing not only our knowledge and experience with the community but also our entire source code for everything we build. That makes the development process in helpwave more efficient, secure, agile and inclusive.
      We are proud to say that helpwave tasks is a tool that is designed by healthcare workers for healthcare workers.
    `,
    futureTitle: 'The Future of helpwave',
    futureText: `
      Due to our experience in developing helpwave tasks, we were able to identify an underlying problem in the healthcare software market: Deployment of software in the healthcare system is a nightmare. We have to face the reality: IT-infrastructure in hospitals is often unreliable, outdated and not secure.
      Missing interoperability takes its toll on workers and makes maintaining infrastructure harder than anywhere else. High regulatory requirements drive up the price and make it hard for small companies to enter the market. And the market is dominated by a few big players that are not interested in changing the status quo.
      This is were helpwave comes in: We are developing a platform that is designed to make the deployment of software in the healthcare system easier. We want to give control back to the hospitals over their infrastructure and their data. By using cutting edge technology we not only want to build the foundation for digitlization in the healthcare market,
      but to open up a whole new entry point into the market for all kinds of new players. For us, this is the true meaning of Open Innovation. Inviting everyone to the table to make the healthcare system better.
    `
  },
  de: {
    ourStory: 'Unsere Geschichte',
    identifyingTheProblemTitle: 'Das Problem erkennen',
    identifyingTheProblemText: `
      helpwave entstand aus einer einfachen Frage: Wie können wir unser Wissen über Software und digitaler Werkzeuge nutzen, um das Leben der Mitarbeitenden im Gesundheitswesen zu erleichtern? Und woran mangelt es der aktuell im Gesundheitssystem genutzten Software?
      In der unmittelbaren Arbeit für die Patienten erleben wir die Frustration veralteter, ineffizienter und nicht intuitiver Software tagtäglich!
      Die Folgen für uns und die Versorgung im Gesundheitssystem sehen wir immer wieder in unserer Arbeit - aber der noch frustrierendere Teil: Krankenhäuser geben Millionen ihres Budgets für diese Tools aus, die ineffizient sind und uns das Leben schwerer machen,
      anstatt es zu vereinfachen. Der weltweite Markt für "Software-as-a-Service" im Gesundheitswesen wird im Jahr 2022 auf rund 28 Milliarden USD geschätzt, mit einem erwarteten Wachstum auf über 75 Milliarden USD allein in den nächsten zehn Jahren. Arbeitest du im Gesundheitswesen?
      Wann hattest du das letzte Mal das Gefühl, dass die Software, die du verwendest, Milliarden wert ist? Eben! helpwave will die Dinge anders angehen: Den Helden des Gesundheitswesens die Software zu liefern, die sie verdienen. Großartige Tools, die das Budget der Krankenhäuser nicht ausbluten lassen.
      Den Krankenhäusern die Kontrolle über ihre Infrastruktur und ihre Daten zurückgeben. Forschern den Zugang zu Daten ermöglichen, um die Patientenversorgung zu verbessern. Und das Wichtigste: Erleichterung des Lebens von Mitarbeitern im Gesundheitswesen.
    `,
    tasksAndOpenInnovationTitle: 'helpwave tasks und das Open-Innovation-Konzept',
    tasksAndOpenInnovationText: `
      Begeistert von all den Menschen, die ihr Leben der Patientenversorgung widmen, wollten wir direkt dorthin, wo wir (am meisten?) bewirken können: Mit helpwave tasks haben wir ein Tool entwickelt, das den Mitarbeitenden im Gesundheitswesen das Leben leichter machen soll.
      Wir bringen moderne Konzepte des Lean Projektmanagements in die Teams des Gesundheitswesens und ermöglichen es den Mitarbeitenden im Gesundheitswesen, eine Lücke zu füllen, die ihre derzeitige Software nicht abdeckt. Wir wollen sicherstellen, dass helpwave tasks nicht nur ein weiteres Tool ist,
      das im Gesundheitswesen verwendet wird, sondern ein Tool, das von den Menschen, die es verwenden, geliebt wird. Deshalb haben wir, Designer, Entwickler und Visionäre mit den Menschen zusammengebracht, die es tagtäglich anwenden: Ärztinnen und Ärzte, Pflegepersonal, Studierenden, Forschenden und Verwaltungsangestellte.
      Wir wollten ihnen ein Werkzeug an die Hand geben, mit dem sie ihre Arbeit besser organisieren, effizienter kommunizieren und einen besseren Überblick über ihre Aufgaben behalten können. Wir wollten ihnen ein Werkzeug an die Hand geben, das einfach zu bedienen ist, das intuitiv ist und einfach Spaß macht!
      Bei helpwave erfolgt die Softwareentwicklung nicht von oben nach unten. Die Mitarbeiter des Gesundheitswesens werden von Anfang an in die Diskussion einbezogen. Jeder Schritt wird von echten Mitarbeitern des Gesundheitswesens mit jahrelanger Erfahrung aus verschiedenen Bereichen überprüft.
      Funktionswünsche und Vorschläge kommen direkt aus den Stationen, Operationssälen und Forschungslabors unserer Community. helpwave ist ein Open Innovation und Open Source Unternehmen. Was heißt das genau? Wir glauben, dass die besten Ideen von den Menschen kommen, die direkt von den Problemen betroffen sind,
      die wir zu lösen versuchen. Und wir glauben, dass in einem Gesundheitssystem, das auf der Idee des Wissens- und Erfahrungsaustauschs aufbaut, Software nicht anders sein sollte. Deshalb haben wir uns verpflichtet, nicht nur unser Wissen und unsere Erfahrung mit der Gemeinschaft zu teilen, sondern auch unseren
      gesamten Quellcode für alles was wir entwickeln. Das macht den Entwicklungsprozess bei helpwave effizienter, sicherer, agiler und integrativer. Wir sind stolz darauf, sagen zu können, dass helpwave tasks ein Tool ist, das von Menschen im Gesundheitswesen für Menschen im Gesundheitswesen entwickelt wurde.
    `,
    futureTitle: 'Die Zukunft von helpwave',
    futureText: `
      Aufgrund unserer Erfahrung bei der Entwicklung von helpwave tasks waren wir in der Lage, ein grundlegendes Problem auf dem Markt für Software im Gesundheitswesen zu erkennen: Der Einsatz von Software im Gesundheitswesen ist ein Albtraum. Die Realität: Die IT-Infrastruktur in Krankenhäusern ist oft unzuverlässig,
      veraltet und schlicht nicht sicher. Fehlende Interoperabilität fordert ihren Tribut von den Mitarbeitenden und macht die Wartung der Infrastruktur schwieriger als anderswo. Hohe regulatorische Anforderungen treiben den Preis in die Höhe und machen es kleinen Unternehmen schwer, in den Markt einzutreten.
      Und der Markt wird von einigen wenigen großen Akteuren beherrscht, die nicht daran interessiert sind, den Status quo zu ändern. Hier kommt helpwave ins Spiel: Wir entwickeln eine Plattform, die den Einsatz von Software im Gesundheitssystem erleichtern soll. Wir wollen den Krankenhäusern die Kontrolle über ihre Infrastruktur und ihre Daten zurückgeben.
      Durch den Einsatz von Spitzentechnologie wollen wir nicht nur die Grundlage für die Digitalisierung des Gesundheitsmarktes schaffen, sondern auch einen völlig neuen Zugang zum Markt für alle möglichen neuen Akteure eröffnen. Für uns ist das die wahre Bedeutung von Open Innovation. Wir laden alle ein, das Gesundheitssystem besser zu machen.
    `
  }
}

const StoryStartSection = ({ overwriteTranslation }: PropsForTranslation<StoryStartSectionTranslation>) => {
  const translation = useTranslation(defaultStoryStartSectionTranslation, overwriteTranslation)

  return (
    <SectionBase className="col gap-y-8">
      <div
        className="col tablet:row max-tablet:text-center gap-8 text-6xl text-negative items-center">
        <Popcorn size="128" color="#A54F5C" className="inline max-tablet:w-full"/>
        {translation.ourStory}
      </div>

      <div>
        <h2 className="font-space text-4xl font-light">
          1. {translation.identifyingTheProblemTitle}
        </h2>
        <p className="mt-2 text-justify">
          {translation.identifyingTheProblemText}
        </p>
      </div>

      <div>
        <h2 className="font-space text-4xl font-light">
          2. {translation.tasksAndOpenInnovationTitle}
        </h2>
        <p className="mt-2 text-justify">
          {translation.tasksAndOpenInnovationText}
        </p>
      </div>

      <div>
        <h2 className="font-space text-4xl font-light">
          3. {translation.futureTitle}
        </h2>
        <p className="mt-2 text-justify">
          {translation.futureText}
        </p>
      </div>
    </SectionBase>
  )
}

export default StoryStartSection
