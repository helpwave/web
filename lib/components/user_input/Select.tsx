import { tw, tx } from '../../twind'
import { Menu } from '@headlessui/react'
import { ChevronDown, ChevronUp } from 'lucide-react'

type Option<T> = {
  label: string,
  value: T
}

type SelectProps<T> = {
  value?: T,
  label?: string,
  options: Option<T>[],
  onChange: (value: T) => void,
  isHidingCurrentValue?: boolean,
  hintText?: string,
  className?: string
};

/**
 * A Select Component for selecting form a list of options
 *
 * The State is managed by the parent
 */
export const Select = <T, >({ value, label, options, onChange, isHidingCurrentValue = true, hintText = '', className }: SelectProps<T>) => {
  // Notice: for more complex types this check here might need an additional compare method
  const filteredOptions = isHidingCurrentValue ? options.filter(option => option.value !== value) : options
  return (
    <div className={tx(className)}>
      {label && (
        <label htmlFor={label} className={tw('text-lg font-semibold mb-1')}>
          {label}
        </label>
      )}
      <Menu as="div" className={tw('relative w-full text-gray-700')}>
        {({ open }) => (
          <>
            <Menu.Button
              className={tx('inline-flex w-full justify-between items-center rounded-t-lg border-2 px-4 py-3 hover:bg-gray-100 font-medium', { 'rounded-b-lg': !open })}
            >
              <span>{options.find(option => option.value === value)?.label ?? hintText}</span>
              {open ? <ChevronUp/> : <ChevronDown/>}
            </Menu.Button>
            <Menu.Items
              className={tw('absolute w-full z-10 rounded-b-lg bg-white shadow-lg')}>
              {filteredOptions.map((option, index) => (
                <Menu.Item key={option.label}>
                  {
                    <div
                      className={tx('px-4 py-2 cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis hover:bg-gray-100 border-2 border-t-0', {
                        'bg-gray-100 ': option.value === value,
                        'bg-gray-50': index % 2 === 1,
                        'border-b-0 rounded-b-lg': index === filteredOptions.length - 1,
                      })}
                      onClick={() => onChange(option.value)}
                    >
                      {option.label}
                    </div>
                  }
                </Menu.Item>
              ))}
            </Menu.Items>
          </>
        )}
      </Menu>
    </div>
  )
}
