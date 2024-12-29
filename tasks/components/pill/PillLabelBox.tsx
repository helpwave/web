import { tw } from '@helpwave/common/twind'
import { tx } from '@twind/core'

export type PillLabelBoxProps = {
  unscheduled: number,
  inProgress: number,
  done: number,
}

/**
 * A Label for showing all TaskState information like the state name and the count of all Tasks in this state.
 *
 * For each state unscheduled, in progress and done there will be a number
 */
const PillLabelBox = ({ unscheduled, inProgress, done }: PillLabelBoxProps) => {
  const between = '3.2px'
  const height = '12px' // equivalent to 1.5rem / 2 = 24px / 2 = h-6 / 2 of tailwind
  const borderWidth = `border-y-[${height}] border-x-[${between}]`
  return (
    <div className={tw('flex flex-row h-6')}>
      <div
        className={tx('flex flex-row bg-hw-label-1-50 rounded-l-md pl-2 pr-1 items-center text-hw-label-1-900')}>
        <div className={tw(`rounded-full w-2 h-2 bg-hw-label-1-400 mr-1`)}/>
        {unscheduled}
      </div>
      <div
        className={tw(`w-0 h-0 border-hw-label-1-50 border-solid border-r-transparent border-b-transparent ${borderWidth}`)}
      />
      <div
        className={tw(`w-0 h-0 border-hw-label-2-50 border-solid border-l-transparent border-t-transparent ${borderWidth}`)}
      />
      <div className={tw('flex flex-row bg-hw-label-2-50 px-1 items-center text-hw-label-2-900')}>
        <div className={tw(`rounded-full w-2 h-2 bg-hw-label-2-400 mr-1`)}/>
        {inProgress}
      </div>
      <div
        className={tw(`w-0 h-0 border-hw-label-2-50 border-solid border-r-transparent border-b-transparent ${borderWidth}`)}
      />
      <div
        className={tw(`w-0 h-0 border-hw-label-3-50 border-solid border-l-transparent border-t-transparent ${borderWidth}`)}
      />
      <div
        className={tw('flex flex-row bg-hw-label-3-50 rounded-r-md pl-1 pr-2 items-center text-hw-label-3-900')}>
        <div className={tw(`rounded-full w-2 h-2 bg-hw-label-3-400 mr-1`)}/>
        {done}
      </div>
    </div>
  )
}

export { PillLabelBox }
