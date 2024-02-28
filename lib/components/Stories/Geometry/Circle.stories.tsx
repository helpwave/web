import type { Meta, StoryObj } from '@storybook/react'
import { Circle } from '../../Circle'

const meta = {
  title: 'Geometry/Circle',
  component: Circle,
} satisfies Meta<typeof Circle>

export default meta
type Story = StoryObj<typeof meta>;

export const CircleVariation: Story = {
  args: {
    radius: 40,
    color: 'hw-primary-400',
    className: '',
  },
}
