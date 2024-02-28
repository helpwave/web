import type { Meta, StoryObj } from '@storybook/react'
import { StackingModals } from '../../examples/StackingModals'

const meta: Meta = {
  title: 'Other/StackingModals',
  component: StackingModals,
}

export default meta
type Story = StoryObj<typeof meta>;

export const StackingModalsStory: Story = {
  render: () => <StackingModals />,
  args: {
  }
}
