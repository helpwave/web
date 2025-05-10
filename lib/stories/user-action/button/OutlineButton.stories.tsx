import type { Meta, StoryObj } from '@storybook/react'
import { OutlineButton } from '../../../components/Button'
import { action } from '@storybook/addon-actions'

const meta = {
  title: 'User-Action/Button',
  component: OutlineButton,
} satisfies Meta<typeof OutlineButton>

export default meta
type Story = StoryObj<typeof meta>;

export const OutlineButtonVariation: Story = {
  args: {
    children: 'Test',
    color: 'primary',
    size: 'medium',
    disabled: false,
    className: 'rounded',
    onClick: action('Clicked'),
  },
}
