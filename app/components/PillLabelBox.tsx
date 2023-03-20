import { tw } from '@helpwave/common/twind/index'

export type PillLabelBoxProps = {
  unscheduledTasks: number,
  inProgressTasks: number,
  doneTasks: number
}

const PillLabelBox = ({ unscheduledTasks, inProgressTasks, doneTasks }: PillLabelBoxProps) => {
  const between = '0.2rem'
  const height = '0.75rem' // equivalent to h-6 of tailwind
  return (
    <div className={tw('flex flex-row h-6')}>
      <div className={tw('flex flex-row bg-hw-label-1-background rounded-l-md pl-2 pr-1 items-center text-hw-label-1-text')}>
        <div className={tw(`rounded-full w-2 h-2 bg-hw-label-1-accent mr-1`)}/>
        {unscheduledTasks.toString()}
      </div>
      <div
        className={tw('w-0 h-0 border-hw-label-1-background border-solid border-r-transparent border-b-transparent')}
        style={{
          borderBottomWidth: height,
          borderRightWidth: between,
          borderLeftWidth: between,
          borderTopWidth: height
        }}/>
      <div
        className={tw('w-0 h-0 border-hw-label-2-background border-solid border-l-transparent border-t-transparent')}
        style={{
          borderBottomWidth: height,
          borderRightWidth: between,
          borderLeftWidth: between,
          borderTopWidth: height
        }}/>
      <div className={tw('flex flex-row bg-hw-label-2-background px-1 items-center text-hw-label-2-text')}>
        <div className={tw(`rounded-full w-2 h-2 bg-hw-label-2-accent mr-1`)}/>
        {inProgressTasks.toString()}
      </div>
      <div
        className={tw('w-0 h-0 border-hw-label-2-background border-solid border-r-transparent border-b-transparent')}
        style={{
          borderBottomWidth: height,
          borderRightWidth: between,
          borderLeftWidth: between,
          borderTopWidth: height
        }}/>
      <div
        className={tw('w-0 h-0 border-hw-label-3-background border-solid border-l-transparent border-t-transparent')}
        style={{
          borderBottomWidth: height,
          borderRightWidth: between,
          borderLeftWidth: between,
          borderTopWidth: height
        }}/>
      <div className={tw('flex flex-row bg-hw-label-3-background rounded-r-md pl-1 pr-2 items-center text-hw-label-3-text')}>
        <div className={tw(`rounded-full w-2 h-2 bg-hw-label-3-accent mr-1`)}/>
        {doneTasks.toString()}
      </div>
    </div>
  )
}

export { PillLabelBox }
