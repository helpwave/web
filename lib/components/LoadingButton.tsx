import { tx } from '../twind'
import { Helpwave } from '../icons/Helpwave'
import type { ButtonProps } from './Button'
import { Button } from './Button'

type LoadingButtonProps = {
  isLoading?: boolean,
} & ButtonProps

export const LoadingButton = ({ isLoading = false, ...rest }: LoadingButtonProps) => {
  return (
    <div className={tx('inline-block relative')}>
      {
        isLoading && (
          <div className={tx('absolute inset-0 flex justify-center items-center bg-white/50')}>
            <div className={tx('bg-white opacity-50')}/>
            <Helpwave animate="loading"/>
          </div>
        )
      }
      <Button {...rest} disabled={rest.disabled || isLoading}/>
    </div>
  )
}
