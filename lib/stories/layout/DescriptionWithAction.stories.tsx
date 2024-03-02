import type { Meta, StoryObj } from '@storybook/react'
import { DescriptionWithAction } from '../../components/DescriptionWithAction'

const meta = {
  title: 'Layout',
  component: DescriptionWithAction,
} satisfies Meta<typeof DescriptionWithAction>

export default meta
type Story = StoryObj<typeof meta>;

export const DescriptionWithActionVariation: Story = {
  args: {
    title: 'Titletext',
    description: 'This is a very very long Description text informing you about something truely important',
    leadingIcon: 'label',
    trailingButtonText: 'Take Action',
    className: ''
  },
}
