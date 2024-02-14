import type { Meta, StoryObj } from '@storybook/react'
import { Ring } from '../Ring'

const meta = {
  title: 'Rings',
  component: Ring,
} satisfies Meta<typeof Ring>

export default meta
type Story = StoryObj<typeof meta>;

export const RingVariation: Story = {
  args: {
    innerSize: 40,
    width: 10,
    color: 'hw-primary-400',
    className: '',
  },
}
