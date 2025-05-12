import type { Meta, StoryObj } from '@storybook/react'
import { Ring } from '../../../components/Ring'

const meta = {
  title: 'Geometry/Rings',
  component: Ring,
} satisfies Meta<typeof Ring>

export default meta
type Story = StoryObj<typeof meta>;

export const RingVariation: Story = {
  args: {
    innerSize: 40,
    width: 10,
  },
}
