import type { Meta, StoryObj } from '@storybook/react'
import { tw } from '@twind/core'
import type { TooltipProps } from '../../../components/Tooltip'
import { Tooltip } from '../../../components/Tooltip'

type TooltipExampleProps = Omit<TooltipProps, 'children' | 'tooltip'> & { tooltipText: string }

const TooltipExample = ({ tooltipText, ...props } : TooltipExampleProps) => {
  return (
    <Tooltip tooltip={tooltipText} {...props}><span className={tw('bg-hw-primary-400 text-white px-2 py-1 rounded-lg')}>Hover over me</span></Tooltip>
  )
}

const meta = {
  title: 'Other/Tooltip',
  component: TooltipExample,
} satisfies Meta<typeof TooltipExample>

export default meta
type Story = StoryObj<typeof meta>;

export const TooltipExampleStory: Story = {
  args: {
    tooltipText: 'Tooltip',
    animationDelay: 700,
    position: 'bottom',
    zIndex: 10,
    offset: 6,
    containerClassName: '',
    tooltipClassName: ''
  },
}
