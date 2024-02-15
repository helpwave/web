import { tw } from '@helpwave/common/twind'
import { Popcorn } from 'lucide-react'

const StartSection = () => {
  return (
    <div className={tw('pt-32')}>
      <div className={tw('ml-8 font-inter text-6xl font-light font-hw-error mobile:text-center')}>
        <Popcorn size="128" color="#A54F5C" className={tw('inline mobile:w-full mobile:mt-2 mr-16')} />
        Our Story
      </div>

      <div className={tw('m-8 parent')}>
        <h2 className={tw('font-space text-4xl font-light')}>
          1. Identifying the Problem
        </h2>
        <p className={tw('mt-2')}>
          helpwave emerged from a simple problem: how can we use our knowledge on software and digital tools to make the lifes of healthcare workers easier? And what is software currently used in the healthcare system lacking? All of us who work at the frontline of healthcare have experienced the frustration of outdated, inefficient, and non-intuitive software. We have seen the consequences of this in our daily work, and we have seen the consequences of this in the lives of our patients and the consequences on our lifes, too!<br />
          The even more frustrating part: Hospitals spend millions of their budget on tools that are inefficient and make our lifes harder. The global healthcare software as a service market size was valued around 28 billion USD in 2022, with an expected growth to over 75 billion USD in the next ten years alone. Well, you guys work in the healthcare system, when did you last feel like the software you're using is worth billions? We didn't think so.<br />
          helpwave wants to do things differently: Delivering the software to healthcare heros that they deserve. Great tools that don't bleed out the hosptials budget. Giving control back to the hospitals over their infrastructure and their data. Enabling researchers to access data to improve patient care. And most importantly: Making the lifes of healthcare workers easier.
        </p>
      </div>

      <div className={tw('m-8 parent')}>
        <h2 className={tw('font-space text-4xl font-light')}>
          2. helpwave tasks and the Open Innovation Concept
        </h2>
        <p className={tw('mt-2')}>
          Enthusiastic as we were for the people that dedicate their lifes to patient care, we wanted to go directly to the frontlines: With helpwave tasks we developed a tool that is designed to make the lifes of healthcare workers easier. Bringing modern concepts of lean project management into healthcare teams and enabling healthcare workers to fill a gap that their current set of tools does not cover. We wanted to make sure that helpwave tasks is not just another tool that is used in the healthcare system, but a tool that is loved by the people that use it.<br />
          So we brought together designers, developers and visionaries with the people of the front line: doctors, nurses, students, researchers and administrators. We wanted to give them a tool that enables them to better organize their work, to communicate more efficiently and to have a better overview of their tasks. We wanted to give them a tool that is easy to use, that is intuitive and just plain fun!<br />
          At helpwave, software development does not happen in a top down approach. Healthcare workers are part of the discussion from the very beginning. Every step of the way is reviewed by real healthcare workers with years of experience from different fields. Feature requests and suggestions come directly from the wards, operating rooms and research labs of our community.
          helpwave is an Open Innovation and Open Source company. What does that mean? Well, we believe that the best ideas come from the people that are directly affected by the problems we are trying to solve. And we believe that in a healthcare system that is built on the idea of sharing knowledge and experience, software should be no different. So we are committed to sharing not only our knowledge and experience with the community but also our entire source code for everything we build. That makes the development process in helpwave more efficient, secure, agile and inclusive.<br />
          We are proud to say that helpwave tasks is a tool that is designed by healthcare workers for healthcare workers.
        </p>
      </div>

      <div className={tw('m-8 parent')}>
        <h2 className={tw('font-space text-4xl font-light')}>
          3. The Future of helpwave
        </h2>
        <p className={tw('mt-2')}>
          Due to our experience in developing helpwave tasks, we were able to identify an underlying problem in the healthcare software market: Deployment of software in the healthcare system is a nightmare. We have to face the reality: IT-infrastructure in hospitals is often unreliable, outdated and not secure. Missing interoperability takes its toll on workers and makes maintaining infrastructure harder than anywhere else. High regulatory requirements drive up the price and make it hard for small companies to enter the market. And the market is dominated by a few big players that are not interested in changing the status quo.<br />
          This is were helpwave comes in: We are developing a platform that is designed to make the deployment of software in the healthcare system easier. We want to give control back to the hospitals over their infrastructure and their data. By using cutting edge technology we not only want to build the foundation for digitlization in the healthcare market, but to open up a whole new entry point into the market for all kinds of new players. For us, this is the true meaning of Open Innovation. Inviting everyone to the table to make the healthcare system better.<br />
        </p>
      </div>

    </div>
  )
}

export default StartSection
