import type { Meta, StoryObj } from '@storybook/react'
import { SolidButton } from '../../../components/Button'
import { action } from '@storybook/addon-actions'

const meta = {
  title: 'User-Action/Button',
  component: SolidButton,
} satisfies Meta<typeof SolidButton>

export default meta
type Story = StoryObj<typeof meta>;

export const SolidButtonVariation: Story = {
  args: {
    children: 'Test',
    color: 'primary',
    size: 'medium',
    disabled: false,
    className: 'rounded',
    onClick: action('Clicked'),
  },
}
