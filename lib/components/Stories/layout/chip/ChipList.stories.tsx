import type { Meta, StoryObj } from '@storybook/react'
import { ChipList } from '../../../ChipList'

const meta = {
  title: 'Layout/Chip',
  component: ChipList,
} satisfies Meta<typeof ChipList>

export default meta
type Story = StoryObj<typeof meta>;

export const ChipListVariation: Story = {
  args: {
    list: [
      { label: 'Chip 1' },
      { label: 'Chip 2' },
      { label: 'Chip 3 with longer text' },
      { label: 'Chip 4' },
      { label: 'Chip 5 with text' },
      { label: 'Chip 6' },
      { label: 'Chip 7' },
      { label: 'Chip 8 with very very long text' },
      { label: 'Chip 9' },
    ],
    className: ''
  },
}
