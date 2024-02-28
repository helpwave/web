import type { Meta, StoryObj } from '@storybook/react'
import { MultiSelectPropertyExample } from '../../../examples/properties/MultiSelectPropertyExample'

const meta = {
  title: 'User-Action/Property',
  component: MultiSelectPropertyExample,
} satisfies Meta<typeof MultiSelectPropertyExample>

export default meta
type Story = StoryObj<typeof meta>;

export const MultiSelectPropertyVariation: Story = {
  args: {
    name: 'Fruits',
    softRequired: false,
    options: [
      { value: 'apple', label: 'Apple', selected: false },
      { value: 'pear', label: 'Pear', selected: false },
      { value: 'plum', label: 'Plum', selected: false },
      { value: 'strawberry', label: 'Strawberry', selected: false, disabled: true },
      { value: 'orange', label: 'Orange', selected: false },
      { value: 'maracuja', label: 'Maracuja', selected: false },
      { value: 'lemon', label: 'Lemon', selected: false },
      { value: 'pineapple', label: 'Pineapple', selected: false },
      { value: 'kiwi', label: 'Kiwi', selected: false },
      { value: 'watermelon', label: 'Watermelon', selected: false },
    ],
    readOnly: false,
    hintText: 'Select',
    enableSearch: true,
    showDisabledOptions: true
  },
}
