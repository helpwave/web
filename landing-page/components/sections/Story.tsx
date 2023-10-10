import { tw } from '@helpwave/common/twind'

const StorySection = () => {
  return (
    <div className={tw('m-auto py-16 relative flex mobile:flex-wrap gap-16')}>
      <div className={tw('desktop:w-1/2')}>
        <h4 className={tw('text-xl text-green-600')}>Providing healthcare solutions</h4>
        <h1 className={tw('text-4xl font-space font-bold')}>We enable healthcare workers</h1>
        <br />
        <p className={tw('text-md text-justify')}>
          At helpwave, we're not just creating healthcare software; we're co-creating it with you, the end-users. By directly involving you in the process, we're elevating quality and nurturing stronger development relationships. This unique approach allows our dedicated developers and engineers to laser-focus on turning your requirements into innovative software features.
        </p>
      </div>

      <div className={tw('desktop:w-1/2')}>
        <h4 className={tw('text-xl text-green-600')}></h4>
        <h1 className={tw('text-4xl font-space font-bold')}>Passion is key for helpwave&#39;s vision!</h1>
        <br />
        <p className={tw('text-md text-justify')}>
          Our commitment to maintaining the highest level of agility, much like what helpwave embodies, is driving unprecedented innovation across medical branches. Experience a healthcare software development like never before and join us on this transformative journey
        </p>
      </div>
    </div>
  )
}

export default StorySection
