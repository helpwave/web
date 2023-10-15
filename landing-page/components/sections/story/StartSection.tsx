import { tw } from '@helpwave/common/twind'
import { Popcorn } from 'lucide-react'

const StartSection = () => {
  return (
    <div className={tw('pt-32')}>
      <div className={tw('ml-8 font-inter text-6xl font-light font-hw-error mobile:text-center')}>
        <Popcorn size="128" color="#A54F5C" className={tw('inline mobile:w-full mobile:mt-2 mr-16')}/>
        Story time!
      </div>

      <div className={tw('m-8 parent')}>
        <h2 className={tw('font-space text-4xl font-light')}>
          1. helpwave&lsquo;s Journey Unfolds
        </h2>
        <p className={tw('mt-2')}>
          helpwave emerged during the Münsterhack 2022, where it initially began as a first-aid app for citizens. Our team clinched the Viewers Choice award, and later, we received support through the Solution Enabler Program 2022. It was during this hackathon that the worlds of medicine and technology merged to form what we now know as helpwave.<br />
          With a strong commitment to open-source software and active involvement from healthcare professionals, we introduced the first product, helpwave tasks, in February 2023. Around this time, helpwave also won the REACH Preincubator partnership, leading to the development of potential business cases and a thorough evaluation of helpwave tasks market viability.
        </p>
      </div>

      <div className={tw('m-8 parent')}>
        <h2 className={tw('font-space text-4xl font-light')}>
          2. Development of tasks Takes Shape
        </h2>
        <p className={tw('mt-2')}>
          It became evident that helpwave&lsquo;s primary focus lay in data governance. This means that, before diving into advanced data science applications for healthcare, helpwave prioritized access, storage, and data management. This approach also extended to helpwave tasks, which initially assists in aggregating and processing event data from existing hospital processes.<br />

          Even when used as a simple productivity tool (a to-do app), helpwave tasks offers significant benefits to hospitals and their staff. It can save up to 3 hours per shift on documentation and collaboration planning, resulting in remarkable efficiency gains.<br />

          Thus, the idea of a to-do app for doctors and healthcare professionals evolved into an open-source product designed for both computers and mobile devices, specifically tailored for use in healthcare settings. Our development team maintains close collaboration with the Medical Team, acting as product owners. This approach ensures that the app consistently meets the high standards of its users throughout its development.
        </p>
      </div>

      <div className={tw('m-8 parent')}>
        <h2 className={tw('font-space text-4xl font-light')}>
          3. Market Entry Planning
        </h2>
        <p className={tw('mt-2')}>
          Thanks to the RWTH Innovation Ideation Program, helpwave has taken a significant step toward its first sale by September 2023. It is now clear that helpwave tasks is in demand at various clinics in Germany and will have a profound impact on the country&lsquo;s healthcare sector.<br />

          Furthermore, the expansion of our product portfolio with helpwave cloud (private cloud infrastructure for each clinic on-site) and helpwave scaffold (digital twin of each clinic for gathering core information and real-time updates from stations) now presents a coherent digitalization strategy for all major hospitals.<br />

          However, as such large-scale projects cannot be implemented in healthcare facilities overnight, helpwave is gearing up for the first productive deployment of the software in Q1 2024.
        </p>
      </div>

    </div>
  )
}

export default StartSection
