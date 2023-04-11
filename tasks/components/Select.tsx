import { tw } from '@helpwave/common/twind/index'
import { useState } from 'react'

type SelectProps = {
  label: string,
  options: string[],
  onChange: (value: string) => void
};

export const Select = ({ label, value, onChange, options }: SelectProps) => {
  const [selected, setSelected] = useState<string>(value)
  const [open, setOpen] = useState<boolean>(false)

  const handleChange = (value: string) => {
    setSelected(value)
    onChange(value)
  };

  return (
    <div className={tw('flex flex-col mx-2')}>
      <label className={tw('text-base font-bold mb-1 text-slate-700')}>
        {label}
      </label>
      <select
        className={tw(
          'mt-1 block rounded-md w-full border-gray-300 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-indigo-500'
        )}
        value={selected}
        onChange={(e) => handleChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option} className={tw('text-slate-700')}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
