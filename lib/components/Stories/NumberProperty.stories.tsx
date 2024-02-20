import type { Meta, StoryObj } from '@storybook/react'
import { NumberPropertyExample } from '../examples/properties/NumberPropertyExample'

const meta = {
  title: 'Property',
  component: NumberPropertyExample,
} satisfies Meta<typeof NumberPropertyExample>

export default meta
type Story = StoryObj<typeof meta>;

export const NumberPropertyVariation: Story = {
  args: {
    name: 'Property',
    required: false,
    value: undefined,
    suffix: 'kg',
    readOnly: false,
    className: '',
  },
}
