import type { ReactNode } from 'react'
import { Binary, CalendarDays, List, Type } from 'lucide-react'
import { tw, tx } from '../twind'
import { Input } from './user-input/Input'

type BaseProperty<T> = {
  name: string,
  required?: boolean,
  className?: string,
  property: T
}

type DateProperty = {
  type: 'date',
  date: Date,
  onChange: (date: Date) => void
}

type NumberProperty = {
  type: 'number',
  value: number,
  suffix: string,
  onChange: (value: Date) => void
}

type TextProperty = {
  type: 'text',
  value: string,
  onChange: (value: string) => void
}

type SelectProperty<T> = {
  type: 'select',
  options: T[],
  selected?: T,
  onChange: (value: T) => void
}

type MultiSelectProperty<T> = {
  type: 'multi-select',
  options: MultiSelectProperty<T>[],
  onChange: (value: T) => void
}

export type PropertyProps<T> =
  BaseProperty<DateProperty | NumberProperty | TextProperty | SelectProperty<T> | MultiSelectProperty<T>>

/**
 * A component for showing a property
 */
export const Property = <T, >({
  name,
  required = false,
  className = '',
  property,
}: PropertyProps<T>) => {
  let icon: ReactNode
  let input: ReactNode
  switch (property.type) {
    case 'text':
      icon = <Type size={16} />
      input = (
        <Input
          value={property.value}
          onChange={text => property.onChange(text)}
          className={tw('!border-0 !w-full !outline-none !shadow-none !ring-0')}
        />
      )
      break
    case 'date':
      icon = <CalendarDays size={16} />
      break
    case 'number':
      icon = <Binary size={16} />
      break
    case 'select':
      icon = <List size={16} />
      break
    case 'multi-select':
      icon = <List size={16} />
      break
  }
  return (
    <div
      className={tx('flex flex-row border border-2 rounded-[16px]', {
        'hover:border-hw-primary-800 border-gray-400 text-black': !required,
        'hover:border-hw-warn-800 border-gray-600 text-hw-warn-200': required,
      }, className)}
    >
      <div
        className={
          tx('flex flex-row gap-x-2 min-w-[200px] overflow-hidden px-4 py-2 items-center rounded-l-[14px]', {
            'bg-gray-200': !required,
            'bg-hw-warn-600': required,
          }, className)}
      >
        {icon}
        {name}
      </div>
      <div>
        {input}
      </div>
    </div>
  )
}
