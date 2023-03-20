import { tw } from '@helpwave/common/twind/index'

export type PillLabelBoxProps = {
  unscheduledCount: number,
  inProgressCount: number,
  doneCount: number
}

const PillLabelBox = ({ unscheduledCount, inProgressCount, doneCount }: PillLabelBoxProps) => {
  const between = '0.2rem'
  const height = '0.75rem' // equivalent to 1.5rem / 2 = 24px / 2 = h-6 / 2 of tailwind, half because border is set on both sides
  const borderWidth = `border-y-[${height}] border-x-[${between}]`
  return (
    <div className={tw('flex flex-row h-6')}>
      <div
        className={tw('flex flex-row bg-hw-label-1-background rounded-l-md pl-2 pr-1 items-center text-hw-label-1-text')}>
        <div className={tw(`rounded-full w-2 h-2 bg-hw-label-1-accent mr-1`)}/>
        {unscheduledCount.toString()}
      </div>
      <div
        className={tw(`w-0 h-0 border-hw-label-1-background border-solid border-r-transparent border-b-transparent ${borderWidth}`)}
      />
      <div
        className={tw(`w-0 h-0 border-hw-label-2-background border-solid border-l-transparent border-t-transparent ${borderWidth}`)}
      />
      <div className={tw('flex flex-row bg-hw-label-2-background px-1 items-center text-hw-label-2-text')}>
        <div className={tw(`rounded-full w-2 h-2 bg-hw-label-2-accent mr-1`)}/>
        {inProgressCount.toString()}
      </div>
      <div
        className={tw(`w-0 h-0 border-hw-label-2-background border-solid border-r-transparent border-b-transparent ${borderWidth}`)}
      />
      <div
        className={tw(`w-0 h-0 border-hw-label-3-background border-solid border-l-transparent border-t-transparent ${borderWidth}`)}
      />
      <div
        className={tw('flex flex-row bg-hw-label-3-background rounded-r-md pl-1 pr-2 items-center text-hw-label-3-text')}>
        <div className={tw(`rounded-full w-2 h-2 bg-hw-label-3-accent mr-1`)}/>
        {doneCount.toString()}
      </div>
    </div>
  )
}

export { PillLabelBox }
