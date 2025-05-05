import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Languages } from '../hooks/useLanguage'
import type { PropsForTranslation } from '../hooks/useTranslation'
import { useTranslation } from '../hooks/useTranslation'
import { range } from '../util/array'
import { SolidButton } from './Button'
import clsx from 'clsx'

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
      className={clsx('sticky row p-2 border-2 justify-between rounded-lg shadow-lg', className)}
    >
      <div className="flex-[2] justify-start">
        <SolidButton
          disabled={step === 0}
          onClick={() => {
            update(step - 1)
          }}
          className="row gap-x-1 items-center justify-center"
        >
          <ChevronLeft size={14}/>
          {translation.back}
        </SolidButton>
      </div>
      <div className="row flex-[5] gap-x-2 justify-center items-center">
        {showDots && dots.map((value, index) => {
          const seen = seenSteps.has(index)
          return (
            <div
              key={index}
              onClick={() => seen && update(index)}
              className={clsx('rounded-full w-4 h-4', {
                'bg-primary hover:brightness-75': index === step && seen,
                'bg-primary/40 hover:bg-primary': index !== step && seen,
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
        <div className="flex-[2] justify-end">
          <SolidButton
            onClick={() => update(step + 1)}
            className="row gap-x-1 items-center justify-center"
          >
            {translation.next}
            <ChevronRight size={14}/>
          </SolidButton>
        </div>
      )}
      {step === lastStep && (
        <div className="flex-[2] justify-end">
          <SolidButton
            // TODO check form validity
            disabled={false}
            onClick={onFinish}
            className="row gap-x-1 items-center justify-center"
          >
            <Check size={14}/>
            {translation.confirm}
          </SolidButton>
        </div>
      )}
    </div>
  )
}
