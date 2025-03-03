import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { tw, tx } from '@helpwave/color-themes/twind'
import type { Languages } from '../hooks/useLanguage'
import type { PropsForTranslation } from '../hooks/useTranslation'
import { useTranslation } from '../hooks/useTranslation'
import { range } from '../util/array'
import { SolidButton } from './Button'

type StepperBarTranslation = {
  back: string,
  next: string,
  confirm: string,
}

const defaultStepperBarTranslation: Record<Languages, StepperBarTranslation> = {
  en: {
    back: 'Back',
    next: 'Next Step',
    confirm: 'Create'
  },
  de: {
    back: 'Zurück',
    next: 'Nächster Schritt',
    confirm: 'Erstellen'
  }
}

export type StepperInformation = {
  step: number,
  lastStep: number,
  seenSteps: Set<number>,
}

export type StepperBarProps = {
  stepper: StepperInformation,
  onChange: (step: StepperInformation) => void,
  onFinish: () => void,
  showDots?: boolean,
  className?: string,
}

/**
 * A Component for stepping
 */
export const StepperBar = ({
  overwriteTranslation,
  stepper,
  onChange,
  onFinish,
  showDots = true,
  className = '',
}: PropsForTranslation<StepperBarTranslation, StepperBarProps>) => {
  const translation = useTranslation(defaultStepperBarTranslation, overwriteTranslation)
  const dots = range(0, stepper.lastStep)
  const { step, seenSteps, lastStep } = stepper

  const update = (newStep: number) => {
    seenSteps.add(newStep)
    onChange({ step: newStep, seenSteps, lastStep })
  }

  return (
    <div
      className={tx('sticky flex flex-row p-2 border-2 justify-between rounded-lg shadow-lg', className)}
    >
      <div className={tw('flex flex-[2] justify-start')}>
        <SolidButton
          disabled={step === 0}
          onClick={() => {
            update(step - 1)
          }}
          className={tw('flex flex-row gap-x-1 items-center justify-center')}
        >
          <ChevronLeft size={14}/>
          {translation.back}
        </SolidButton>
      </div>
      <div className={tw('flex flex-row flex-[5] gap-x-2 justify-center items-center')}>
        {showDots && dots.map((value, index) => {
          const seen = seenSteps.has(index)
          return (
            <div
              key={index}
              onClick={() => seen && update(index)}
              className={tx('rounded-full w-4 h-4', {
                'bg-hw-primary-400 hover:bg-hw-primary-600': index === step && seen,
                'bg-hw-primary-200 hover:bg-hw-primary-400': index !== step && seen,
                'bg-gray-200 outline-transparent': !seen,
              },
              {
                'cursor-pointer': seen,
                'cursor-not-allowed': !seen,
              })}
            />
          )
        })}
      </div>
      {step !== lastStep && (
        <div className={tw('flex flex-[2] justify-end')}>
          <SolidButton
            onClick={() => update(step + 1)}
            className={tw('flex flex-row gap-x-1 items-center justify-center')}
          >
            {translation.next}
            <ChevronRight size={14}/>
          </SolidButton>
        </div>
      )}
      {step === lastStep && (
        <div className={tw('flex flex-[2] justify-end')}>
          <SolidButton
            // TODO check form validity
            disabled={false}
            onClick={onFinish}
            className={tw('flex flex-row gap-x-1 items-center justify-center')}
          >
            <Check size={14}/>
            {translation.confirm}
          </SolidButton>
        </div>
      )}
    </div>
  )
}
