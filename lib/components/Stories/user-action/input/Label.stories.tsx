import type { Meta, StoryObj } from '@storybook/react'
import { Label } from '../../../user-input/Label'

const meta = {
  title: 'User-Action/Input',
  component: Label,
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>;

export const LabelVariation: Story = {
  args: {
    name: 'LabelText',
    labelType: 'labelMedium',
    className: '',
  },
}
