import { tw } from '@helpwave/common/twind/index'
import { useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

type Option = {
  label: string,
  value: string
}

type SelectProps = {
  value: string,
  label: string,
  options: Option[],
  onChange: (value: string) => void
};

export const Select = ({ label, onChange, options }: SelectProps) => {
  const [selected, setSelected] = useState<string>(options[0].value)

  const handleChange = (value: string, label: string) => {
    setSelected(label)
    onChange(value)
  };

  return (
    <div className={tw('relative')}>
      <label htmlFor={label} className={tw('block font-semibold mb-1')}>
        {label}
      </label>
      <Menu as="div" className={tw('relative inline-block text-left')}>
        {({ open }) => (
          <>
          <Menu.Button className={tw('inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500')}>
            <span>{selected}</span>
            <ChevronDownIcon className={tw('-mr-1 ml-2 h-5 w-5')} aria-hidden="true" />
          </Menu.Button>
          <Menu.Items className={tw('absolute z-10 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none')}>
          {options.map(option => (
                  <Menu.Item key={option.value}>
                    {({ active }) => (
                      <div
                        className={tw(`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                          option.value === selected ? 'bg-gray-200' : ''
                        }`)}
                        onClick={() => handleChange(option.value, option.label)}
                      >
                        {option.label}
                      </div>
                    )}
                  </Menu.Item>
          ))}
              </Menu.Items>
          </>
        )}
        </Menu>
      </div>
  );
};