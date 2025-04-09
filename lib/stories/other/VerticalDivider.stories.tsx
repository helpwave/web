import type { Meta, StoryObj } from '@storybook/react'
import { VerticalDivider } from '../../components/VerticalDivider'

const meta = {
  title: 'Other/VerticalDivider',
  component: VerticalDivider,
} satisfies Meta<typeof VerticalDivider>

export default meta
type Story = StoryObj<typeof meta>;

export const VerticalDividerBasic: Story = {
  args: {
    width: 1,
    height: 100,
    dashWidth: 0.5,
    dashDistance: 4,
  },
}
