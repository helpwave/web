import { tw } from '@helpwave/common/twind'

type StoryBlockProps = {
  beforeHeader?: string,
  header: string,
  mainText: string
}

const StoryBlock = ({
  beforeHeader = '',
  header,
  mainText,
}: StoryBlockProps) => {
  return (
    <div className={tw('desktop:w-1/2')}>
      <div className={tw('flex flex-column h-[48px] items-end')}>
        <h4 className={tw('text-xl text-green-600')}>{beforeHeader}</h4>
      </div>
      <h1 className={tw('text-4xl font-space font-bold')}>{header}</h1>
      <br/>
      <p className={tw('text-md text-justify')}>
        {mainText}
      </p>
    </div>
  )
}

const StorySection = () => {
  return (
    <div className={tw('m-auto pb-16 pt-8 relative flex mobile:flex-wrap gap-16')}>
      <StoryBlock
        beforeHeader="Providing healthcare solutions"
        header="Providing healthcare solutions"
        mainText={'At helpwave, we\'re not just creating healthcare software; we\'re co-creating it with you, the'
           + ' end-users. By directly involving you in the process, we\'re elevating quality and nurturing stronger'
          + ' development relationships. This unique approach allows our dedicated developers and engineers to laser-focus'
          + ' on turning your requirements into innovative software features.'}
      />
      <StoryBlock
        header={'Passion is key for helpwave\'s vision!'}
        mainText={'Our commitment to maintaining the highest level of agility, much like what helpwave embodies, is driving'
          + ' unprecedented innovation across medical branches. Experience a healthcare software development like never'
          + ' before and join us on this transformative journey'}
      />
    </div>
  )
}

export default StorySection
