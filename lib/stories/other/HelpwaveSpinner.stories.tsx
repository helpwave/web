import type { Meta, StoryObj } from '@storybook/react'
import { Helpwave } from '../../components/icons/Helpwave'

const meta = {
  title: 'Other/Spinner',
  component: Helpwave,
} satisfies Meta<typeof Helpwave>

export default meta
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    color: 'currentColor',
    animate: 'loading',
    width: 128,
    height: 128,
  },
}
