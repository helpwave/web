import type { Meta, StoryObj } from '@storybook/react'
import { TextPropertyExample } from '../../../components/examples/properties/TextPropertyExample'

const meta = {
  title: 'User-Action/Property',
  component: TextPropertyExample,
} satisfies Meta<typeof TextPropertyExample>

export default meta
type Story = StoryObj<typeof meta>;

export const TextPropertyVariation: Story = {
  args: {
    name: 'Property',
    softRequired: false,
    value: undefined,
    readOnly: false,
    className: '',
  },
}
