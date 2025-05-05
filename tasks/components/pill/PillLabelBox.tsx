import clsx from 'clsx'

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
    <div className={clsx('row h-6')}>
      <div
        className={clsx('row rounded-l-md pl-2 pr-1 items-center bg-tag-red-background text-tag-red-text')}>
        <div className={clsx(`rounded-full w-2 h-2 text-tag-red-icon mr-1`)}/>
        {unscheduled}
      </div>
      <div
        className={clsx(`w-0 h-0 border-solid border-r-transparent border-b-transparent ${borderWidth} bg-tag-red-background`)}
      />
      <div
        className={clsx(`w-0 h-0 bg-tag-yellow-background border-solid border-l-transparent border-t-transparent ${borderWidth}`)}
      />
      <div className={clsx('row px-1 items-center bg-tag-yellow-background text-tag-yellow-text')}>
        <div className={clsx(`rounded-full w-2 h-2 mr-1 bg-tag-yellow-icon`)}/>
        {inProgress}
      </div>
      <div
        className={clsx(`w-0 h-0 bg-tag-yellow-background border-solid border-r-transparent border-b-transparent ${borderWidth}`)}
      />
      <div
        className={clsx(`w-0 h-0 bg-tag-green-background border-solid border-l-transparent border-t-transparent ${borderWidth}`)}
      />
      <div
        className={clsx('row bg-tag-green-background rounded-r-md pl-1 pr-2 items-center text-tag-green-text')}>
        <div className={clsx(`rounded-full w-2 h-2 bg-tag-green-icon mr-1`)}/>
        {done}
      </div>
    </div>
  )
}

export { PillLabelBox }
