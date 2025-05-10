import type { Meta, StoryObj } from '@storybook/react'
import { AnimatedRing } from '../../../components/Ring'

const meta = {
  title: 'Geometry/Rings',
  component: AnimatedRing,
} satisfies Meta<typeof AnimatedRing>

export default meta
type Story = StoryObj<typeof meta>;

export const AnimatedRingVariation: Story = {
  args: {
    innerSize: 40,
    width: 10,
    fillAnimationDuration: 3,
  },
}
