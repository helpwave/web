import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../../../components/Button'

const meta = {
  title: 'User-Action/Button',
  component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>;

export const ButtonVariation: Story = {
  args: {
    children: 'Test',
    color: 'accent',
    variant: 'primary',
    size: 'medium',
    disabled: false,
    className: 'rounded',
    onClick: () => {
      console.log('clicked')
    }
  },
}
