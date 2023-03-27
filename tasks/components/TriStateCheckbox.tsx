import { tx } from '@helpwave/common/twind'
import Check from '../icons/Check'
import Minus from '@helpwave/common/icons/Minus'

type TriStateCheckboxProps = {
  checked: boolean | null,
  disabled?: boolean,
  onChanged?: (value: boolean | null) => void
}

export const TriStateCheckbox = ({
  checked,
  disabled = false,
  onChanged = () => undefined
}: TriStateCheckboxProps) => {
  const change = () => {
    const newValue = !(checked === null || checked)
    onChanged(newValue)
  }

  return (
    <div onClick={change}
         className={tx('w-4 h-4 flex items-center border-2 rounded focus:outline-none hover:border-gray-400',
           {
             'bg-hw-primary-300 border-hw-primary-500 hover:border-hw-primary-700': checked === null || checked,
             'bg-white': checked != null && !checked
           })}>
      {checked === null ?
        <Minus className={tx('bg-transparent stroke-hw-primary-500', { 'stroke-gray-400': disabled })}/>
        : (checked ? <Check className={tx('bg-transparent stroke-hw-primary-500', { 'stroke-gray-400': disabled })}/> : null)
      }
    </div>
  )
}
