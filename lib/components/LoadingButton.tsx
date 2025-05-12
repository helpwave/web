import clsx from 'clsx'
import { Helpwave } from './icons/Helpwave'
import type { SolidButtonProps } from './Button'
import { ButtonSizePaddings } from './Button'
import { SolidButton } from './Button'
import { noop } from '../util/noop'

type LoadingButtonProps = {
  isLoading?: boolean,
} & SolidButtonProps

export const LoadingButton = ({ isLoading = false, size = 'medium', onClick, ...rest }: LoadingButtonProps) => {
  const paddingClass = ButtonSizePaddings[size]

  return (
    <div className="inline-block relative">
      {
        isLoading && (
          <div className={clsx('absolute inset-0 row items-center justify-center bg-white/40', paddingClass)}>
            <Helpwave animate="loading" className="text-white"/>
          </div>
        )
      }
      <SolidButton {...rest} disabled={rest.disabled} onClick={isLoading ? noop: onClick}/>
    </div>
  )
}
