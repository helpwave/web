import type { Meta, StoryObj } from '@storybook/react'
import { SolidButton } from '../../../components/Button'

const meta = {
  title: 'User-Action/Button',
  component: SolidButton,
} satisfies Meta<typeof SolidButton>

export default meta
type Story = StoryObj<typeof meta>;

export const ButtonVariation: Story = {
  args: {
    children: 'Test',
    color: 'hw-primary',
    variant: 'background',
    size: 'medium',
    disabled: false,
    className: 'rounded',
    onClick: () => {
      console.log('clicked')
    }
  },
}
