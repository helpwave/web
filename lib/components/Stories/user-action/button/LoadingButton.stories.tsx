import type { Meta, StoryObj } from '@storybook/react'
import { LoadingButton } from '../../../LoadingButton'

const meta = {
  title: 'User-Action/LoadingButton',
  component: LoadingButton,
} satisfies Meta<typeof LoadingButton>

export default meta
type Story = StoryObj<typeof meta>;

export const LoadingButtonVariation: Story = {
  args: {
    children: 'Modify my `isLoading` property',
    color: 'accent',
    variant: 'primary',
    size: 'medium',
    disabled: false,
    className: 'rounded',
  },
}
