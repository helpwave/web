import type { Meta, StoryObj } from '@storybook/react'
import { LoadingButton } from '../../../components/LoadingButton'

const meta = {
  title: 'User-Action/Button',
  component: LoadingButton,
} satisfies Meta<typeof LoadingButton>

export default meta
type Story = StoryObj<typeof meta>;

export const LoadingButtonVariation: Story = {
  args: {
    children: 'Modify my `isLoading` properties',
    color: 'primary',
    size: 'medium',
    disabled: false,
    className: 'rounded',
    isLoading: false,
  },
}
