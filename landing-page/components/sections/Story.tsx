import { tw } from '@helpwave/common/twind'

const StorySection = () => {
  return (
    <div className={tw('m-auto py-16 relative flex gap-16')}>
      <div className={tw('w-1/2')}>
        <h4 className={tw('text-xl text-green-600')}>Providing healthcare solutions</h4>
        <h1 className={tw('text-4xl font-space font-bold')}>Why passion is key for helpwave&#39;s vision!</h1>
        <br />
        <p className={tw('text-md text-justify')}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius error harum corporis aspernatur ullam optio expedita ducimus aliquid doloribus, corrupti delectus magni impedit quas laudantium, sit quos, atque a nam?
        </p>
      </div>

      <div className={tw('w-1/2')}>
        <h4 className={tw('text-xl text-green-600')}></h4>
        <h1 className={tw('text-4xl font-space font-bold')}>We enable healthcare workers</h1>
        <br />
        <p className={tw('text-md text-justify')}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius error harum corporis aspernatur ullam optio expedita ducimus aliquid doloribus, corrupti delectus magni impedit quas laudantium, sit quos, atque a nam?
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius error harum corporis aspernatur ullam optio expedita ducimus aliquid doloribus, corrupti delectus magni impedit quas laudantium, sit quos, atque a nam?
        </p>
      </div>
    </div>
  )
}

export default StorySection
