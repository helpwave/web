import clsx from 'clsx'
import { Helpwave } from '../icons/Helpwave'
import type { SolidButtonProps } from './Button'
import { SolidButton } from './Button'

type LoadingButtonProps = {
  isLoading?: boolean,
} & SolidButtonProps

export const LoadingButton = ({ isLoading = false, ...rest }: LoadingButtonProps) => {
  return (
    <div className={clsx('inline-block relative')}>
      {
        isLoading && (
          <div className={clsx('absolute inset-0 flex justify-center items-center bg-white/50')}>
            <div className={clsx('bg-white opacity-50')}/>
            <Helpwave animate="loading"/>
          </div>
        )
      }
      <SolidButton {...rest} disabled={rest.disabled || isLoading}/>
    </div>
  )
}
