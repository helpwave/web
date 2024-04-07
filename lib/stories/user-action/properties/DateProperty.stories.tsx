import type { Meta, StoryObj } from '@storybook/react'
import { DatePropertyExample } from '../../../components/examples/properties/DatePropertyExample'

const meta = {
  title: 'User-Action/Property',
  component: DatePropertyExample,
} satisfies Meta<typeof DatePropertyExample>

export default meta
type Story = StoryObj<typeof meta>;

export const DatePropertyVariation: Story = {
  args: {
    name: 'Property',
    softRequired: false,
    value: undefined,
    readOnly: false,
    type: 'dateTime',
    className: '',
  },
}
