import type { Meta, StoryObj } from '@storybook/react'
import { AnimatedRing } from '../Ring'

const meta = {
  title: 'Rings',
  component: AnimatedRing,
} satisfies Meta<typeof AnimatedRing>

export default meta
type Story = StoryObj<typeof meta>;

export const AnimatedRingVariation: Story = {
  args: {
    innerSize: 40,
    width: 10,
    color: 'hw-primary-400',
    className: '',
    fillAnimationDuration: 3,
  },
}
