import type { Meta, StoryObj } from '@storybook/react'
import { UncontrolledCheckbox } from '../../../components/user-input/Checkbox'

const meta = {
  title: 'User-Action/Checkbox',
  component: UncontrolledCheckbox,
} satisfies Meta<typeof UncontrolledCheckbox>

export default meta
type Story = StoryObj<typeof meta>;

export const CheckboxVariation: Story = {
  args: {
    defaultValue: true,
    disabled: false,
    id: 'checkbox1',
    size: 'medium',
    label: { name: 'Click me ^^', labelType: 'labelMedium', className: '' },
  },
}
