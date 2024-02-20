import type { Meta, StoryObj } from '@storybook/react'
import { TextPropertyExample } from '../examples/properties/TextPropertyExample'

const meta = {
  title: 'Property',
  component: TextPropertyExample,
} satisfies Meta<typeof TextPropertyExample>

export default meta
type Story = StoryObj<typeof meta>;

export const TextPropertyVariation: Story = {
  args: {
    name: 'Property',
    required: false,
    value: undefined,
    readOnly: false,
    className: '',
  },
}
