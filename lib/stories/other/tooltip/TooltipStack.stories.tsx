import type { Meta, StoryObj } from '@storybook/react'
import { tw } from '@helpwave/style-themes/twind'
import type { TooltipProps } from '../../../components/Tooltip'
import { Tooltip } from '../../../components/Tooltip'

type TooltipStackExampleProps = Omit<TooltipProps, 'children' | 'tooltip'>

const TooltipStackExample = ({ ...props }: TooltipStackExampleProps) => {
  return (
    <Tooltip tooltip={(
      <Tooltip zIndex={11} tooltip={(
        <span>Try to hover <Tooltip tooltip="Great right?" zIndex={12}>
          <span className={tw('font-bold underline')}>here</span>
        </Tooltip></span>
      )}>This is a Text on which you can hover to show
        another Tooltip
      </Tooltip>
    )} {...props}>
      <span className={tw('bg-hw-primary-400 text-white px-2 py-1 rounded-lg')}>Hover over me</span>
    </Tooltip>
  )
}

const meta = {
  title: 'Other/Tooltip',
  component: TooltipStackExample,
} satisfies Meta<typeof TooltipStackExample>

export default meta
type Story = StoryObj<typeof meta>;

export const TooltipStackExampleStory: Story = {
  args: {
    animationDelay: 700,
    position: 'right',
    zIndex: 10,
    offset: 6,
    containerClassName: '',
    tooltipClassName: ''
  },
}
