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
  value,
  ...restProps
}: DatePropertyExampleProps) => {
  const [usedDate, setUsedDate] = useState<Date | undefined>(value)

  useEffect(() => {
    setUsedDate(value)
  }, [value])

  return (<DateProperty {...restProps} onChange={setUsedDate} onRemove={() => setUsedDate(undefined)} value={usedDate}/>)
}
