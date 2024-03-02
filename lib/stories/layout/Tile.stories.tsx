import type { Meta, StoryObj } from '@storybook/react'
import { TileExample } from '../../components/examples/TileExample'

const meta = {
  title: 'Layout/Tile',
  component: TileExample,
} satisfies Meta<typeof TileExample>

export default meta
type Story = StoryObj<typeof meta>;

export const TileVariation: Story = {
  args: {
    title: { value: 'Title', className: '', type: undefined },
    description: { value: 'Description Text', className: '', type: undefined },
    prefix: true,
    suffix: true,
    className: ''
  },
}
