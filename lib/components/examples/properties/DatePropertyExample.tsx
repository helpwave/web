import { useEffect, useState } from 'react'
import type { DatePropertyProps } from '../../Properties/DateProperty'
import { DateProperty } from '../../Properties/DateProperty'

export type DatePropertyExampleProps = Omit<DatePropertyProps, 'onChange'> & {
  readOnly: boolean
}

/**
 * Example for using the DateProperty
 */
export const DatePropertyExample = ({
  date,
  readOnly,
  ...restProps
}: DatePropertyExampleProps) => {
  const [usedDate, setUsedDate] = useState<Date | undefined>(date)

  useEffect(() => {
    setUsedDate(date)
  }, [date])

  return (<DateProperty {...restProps} onChange={readOnly ? undefined : setUsedDate} date={usedDate}/>)
}
