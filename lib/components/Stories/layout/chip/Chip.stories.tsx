import type { Meta, StoryObj } from '@storybook/react'
import { Chip } from '../../../ChipList'

const meta = {
  title: 'Layout/Chip',
  component: Chip,
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>;

export const ChipVariation: Story = {
  args: {
    label: 'Label',
    className: ''
  },
}
