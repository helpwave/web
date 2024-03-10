import type { Meta, StoryObj } from '@storybook/react'
import { CheckboxPropertyExample } from '../../../components/examples/properties/CheckboxPropertyExample'

const meta = {
  title: 'User-Action/Property',
  component: CheckboxPropertyExample,
} satisfies Meta<typeof CheckboxPropertyExample>

export default meta
type Story = StoryObj<typeof meta>;

export const CheckboxPropertyVariation: Story = {
  args: {
    name: 'Property',
    softRequired: false,
    value: false,
    readOnly: false,
    className: '',
  },
}
