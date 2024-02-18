import type { Meta, StoryObj } from '@storybook/react'
import { PropertiesExample } from '../examples/PropertiesExample'

const meta = {
  title: 'Property',
  component: PropertiesExample,
} satisfies Meta<typeof PropertiesExample>

export default meta
type Story = StoryObj<typeof meta>;

export const PropertyVariation: Story = {
  args: {
    type: 'text',
    name: 'Property',
    required: false
  },
}
