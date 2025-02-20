import { Menu } from '@headlessui/react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { tw, tx } from '../../twind'
import type { LabelProps } from './Label'
import { Label } from './Label'

export type SelectOption<T> = {
  label: ReactNode,
  value: T,
  disabled?: boolean,
  className?: string,
}

export type SelectProps<T> = {
  value?: T,
  label?: LabelProps,
  options: SelectOption<T>[],
  onChange: (value: T) => void,
  isHidingCurrentValue?: boolean,
  hintText?: string,
  showDisabledOptions?: boolean,
  className?: string,
  isDisabled?: boolean,
  textColor?: string,
  hoverColor?: string,
  /**
   * The items will be at the start of the select and aren't selectable
   */
  additionalItems?: ReactNode[],
  selectedDisplayOverwrite?: ReactNode,
};

/**
 * A Select Component for selecting form a list of options
 *
 * The State is managed by the parent
 */
export const Select = <T, >({
  value,
  label,
  options,
  onChange,
  isHidingCurrentValue = true,
  hintText = '',
  showDisabledOptions = true,
  isDisabled,
  className,
  textColor = 'text-gray-700',
  hoverColor = 'hover:bg-gray-100',
  additionalItems,
  selectedDisplayOverwrite,
}: SelectProps<T>) => {
  // Notice: for more complex types this check here might need an additional compare method
  let filteredOptions = isHidingCurrentValue ? options.filter(option => option.value !== value) : options
  if (!showDisabledOptions) {
    filteredOptions = filteredOptions.filter(value => !value.disabled)
  }
  const selectedOption = options.find(option => option.value === value)
  if (value !== undefined && selectedOption === undefined && selectedDisplayOverwrite === undefined) {
    console.warn('The selected value is not found in the options list. This might be an error on your part or' +
      ' default behavior if it is complex data type on which === does not work. In case of the latter' +
      ' use selectedDisplayOverwrite to set your selected text or component')
  }

  return (
    <div className={tx(className)}>
      {label && (
        <Label {...label} labelType={label.labelType ?? 'labelBig'} className={tx('mb-1', label.className)}/>
      )}
      <Menu as="div" className={tw('relative text-gray-700')}>
        {({ open }) => (
          <>
            <Menu.Button
              className={tx(
                'inline-flex w-full justify-between items-center rounded-t-lg border-2 px-4 py-2 font-medium bg-white',
                textColor,
                {
                  'rounded-b-lg': !open,
                  [hoverColor]: !isDisabled,
                  'bg-gray-100 cursor-not-allowed text-gray-500': isDisabled
                }
              )}
              disabled={isDisabled}
            >
              <span>{selectedDisplayOverwrite ?? selectedOption?.label ?? hintText}</span>
              {open ? <ChevronUp/> : <ChevronDown/>}
            </Menu.Button>
            <Menu.Items
              className={tw('absolute w-full z-10 rounded-b-lg bg-white shadow-lg max-h-[500px] overflow-y-auto')}
            >
              {(additionalItems ?? []).map((item, index) => (
                <div key={`additionalItems${index}`}
                     className={tx('px-4 py-2 overflow-hidden whitespace-nowrap text-ellipsis border-2 border-t-0', {
                       'border-b-0 rounded-b-lg': filteredOptions.length === 0 && index === (additionalItems?.length ?? 1) - 1,
                     })}
                >
                  {item}
                </div>
              ))}
              {filteredOptions.map((option, index) => (
                <Menu.Item key={`item${index}`}>
                  {
                    <div
                      className={tx('px-4 py-2 overflow-hidden whitespace-nowrap text-ellipsis border-2 border-t-0 cursor-pointer',
                        option.className, {
                          'bg-gray-100': option.value === value,
                          'bg-gray-50': index % 2 === 1,
                          'text-gray-300 cursor-not-allowed': !!option.disabled,
                          'hover:bg-gray-100 cursor-pointer': !option.disabled,
                          'rounded-b-lg': index === filteredOptions.length - 1,
                        })}
                      onClick={() => {
                        if (!option.disabled) {
                          onChange(option.value)
                        }
                      }}
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
