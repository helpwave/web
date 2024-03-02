import type { Meta, StoryObj } from '@storybook/react'
import { Helpwave } from '../../icons/Helpwave'

const meta = {
  title: 'Other/Spinner',
  component: Helpwave,
} satisfies Meta<typeof Helpwave>

export default meta
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    color: '#8070A9',
    animate: 'loading',
    width: 128,
    height: 128,
  },
}
