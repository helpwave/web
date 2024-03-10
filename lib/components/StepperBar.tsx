import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { tw, tx } from '../twind'
import type { Languages } from '../hooks/useLanguage'
import type { PropsWithLanguage } from '../hooks/useTranslation'
import { useTranslation } from '../hooks/useTranslation'
import { range } from '../util/array'
import { Button } from './Button'

type StepperBarTranslation = {
  back: string,
  next: string,
  confirm: string
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
  seenSteps: number[]
}

export type StepperBarProps = {
  stepper: StepperInformation,
  onChange: (step: StepperInformation) => void,
  onFinish: () => void,
  showDots?: boolean,
  className?: string
}

/**
 * A Component for stepping
 */
export const StepperBar = ({
  language,
  stepper,
  onChange,
  onFinish,
  showDots = true,
  className = '',
}: PropsWithLanguage<StepperBarTranslation, StepperBarProps>) => {
  const translation = useTranslation(language, defaultStepperBarTranslation)
  const dots = range(0, stepper.lastStep)
  const { step, seenSteps, lastStep } = stepper

  const update = (newStep: number) => {
    const updatedSeen = [...seenSteps]
    if (!updatedSeen.find(value => value === newStep)) {
      updatedSeen.push(newStep)
    }
    onChange({ step: newStep, seenSteps: updatedSeen, lastStep })
  }

  console.log(stepper)

  return (
    <div
      className={tx('sticky flex flex-row p-2 border-2 justify-between rounded-lg shadow-lg', className)}
    >
      <div className={tw('flex flex-[2] justify-start')}>
        <Button
          disabled={step === 0}
          onClick={() => {
            update(step - 1)
          }}
          variant="tertiary"
          className={tw('flex flex-row gap-x-1 items-center justify-center')}
        >
          <ChevronLeft size={14}/>
          {translation.back}
        </Button>
      </div>
      <div className={tw('flex flex-row flex-[5] gap-x-2 justify-center items-center')}>
        {showDots && dots.map((value, index) => {
          const seen = seenSteps.find(value => value === index) !== undefined
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
          <Button
            onClick={() => update(step + 1)}
            className={tw('flex flex-row gap-x-1 items-center justify-center')}
          >
            {translation.next}
            <ChevronRight size={14}/>
          </Button>
        </div>
      )}
      {step === lastStep && (
        <div className={tw('flex flex-[2] justify-end')}>
          <Button
            // TODO check form validity
            disabled={false}
            onClick={onFinish}
            className={tw('flex flex-row gap-x-1 items-center justify-center')}
          >
            <Check size={14}/>
            {translation.confirm}
          </Button>
        </div>
      )}
    </div>
  )
}
