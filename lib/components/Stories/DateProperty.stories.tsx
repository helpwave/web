import type { Meta, StoryObj } from '@storybook/react'
import { DatePropertyExample } from '../examples/properties/DatePropertyExample'

const meta = {
  title: 'Property',
  component: DatePropertyExample,
} satisfies Meta<typeof DatePropertyExample>

export default meta
type Story = StoryObj<typeof meta>;

export const DatePropertyVariation: Story = {
  args: {
    name: 'Property',
    softRequired: false,
    date: undefined,
    readOnly: false,
    className: '',
  },
}
