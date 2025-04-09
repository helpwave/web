import type { Meta, StoryObj } from '@storybook/react'
import { TextButton } from '../../../components/Button'

const meta = {
  title: 'User-Action/Button',
  component: TextButton,
} satisfies Meta<typeof TextButton>

export default meta
type Story = StoryObj<typeof meta>;

export const TextButtonVariation: Story = {
  args: {
    children: 'Test',
    color: 'negative',
    size: 'medium',
    disabled: false,
    className: 'rounded',
    onClick: () => {
      console.log('clicked')
    }
  },
}
