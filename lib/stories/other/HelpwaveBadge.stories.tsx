import type { Meta, StoryObj } from '@storybook/react'
import { HelpwaveBadge } from '../../components/HelpwaveBadge'

const meta = {
  title: 'Other/HelpwaveBadge',
  component: HelpwaveBadge,
} satisfies Meta<typeof HelpwaveBadge>

export default meta
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    size: 'small',
    title: 'helpwave',
    className: ''
  },
}
