import { useEffect, useState } from 'react'
import type { DatePropertyProps } from '../../properties/DateProperty'
import { DateProperty } from '../../properties/DateProperty'

export type DatePropertyExampleProps = Omit<DatePropertyProps, 'onChange'|'onRemove'> & {
  readOnly: boolean
}

/**
 * Example for using the DateProperty
 */
export const DatePropertyExample = ({
  date,
  ...restProps
}: DatePropertyExampleProps) => {
  const [usedDate, setUsedDate] = useState<Date | undefined>(date)

  useEffect(() => {
    setUsedDate(date)
  }, [date])

  return (<DateProperty {...restProps} onChange={setUsedDate} onRemove={() => setUsedDate(undefined)} date={usedDate}/>)
}
