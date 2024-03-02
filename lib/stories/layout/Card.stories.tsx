import type { Meta, StoryObj } from '@storybook/react'
import { Card } from '../../components/Card'

const meta = {
  title: 'Layout/Card',
  component: Card,
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>;

export const CardTestVariation: Story = {
  args: {
    isSelected: true,
    onTileClick: () => {
      console.log('clicked')
    },
    className: 'rounded',
    children: <div>Testing Card</div>
  },
}
