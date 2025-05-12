import type { Meta, StoryObj } from '@storybook/react'
import { ChipList } from '../../../components/ChipList'

const meta = {
  title: 'Layout/Chip',
  component: ChipList,
} satisfies Meta<typeof ChipList>

export default meta
type Story = StoryObj<typeof meta>;

export const ChipListVariation: Story = {
  args: {
    list: [
      { children: 'Chip 1' },
      { children: 'Chip 2' },
      { children: 'Chip 3 with longer text' },
      { children: 'Chip 4 different children', variant: 'fullyRounded' },
      { children: 'Chip 5 with text' },
      { children: 'Chip 6 custom style', className: '!bg-red-400' },
      { children: 'Chip 7 in dark color', color: 'dark' },
      { children: 'Chip 8 with very very long text' },
      { children: 'Chip 9' },
    ],
    className: ''
  },
}
