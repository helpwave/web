import type { Meta, StoryObj } from '@storybook/react'
import { SingleSelectPropertyExample } from '../../../components/examples/properties/SelectPropertyExample'

const meta = {
  title: 'User-Action/Property',
  component: SingleSelectPropertyExample,
} satisfies Meta<typeof SingleSelectPropertyExample>

export default meta
type Story = StoryObj<typeof meta>;

export const SingleSelectPropertyVariation: Story = {
  args: {
    value: undefined,
    name: 'Fruits',
    softRequired: false,
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'pear', label: 'Pear' },
      { value: 'plum', label: 'Plum' },
      { value: 'strawberry', label: 'Strawberry', disabled: true },
      { value: 'orange', label: 'Orange' },
      { value: 'maracuja', label: 'Maracuja' },
      { value: 'lemon', label: 'Lemon' },
      { value: 'pineapple', label: 'Pineapple' },
      { value: 'kiwi', label: 'Kiwi' },
      { value: 'watermelon', label: 'Watermelon' },
    ],
    readOnly: false,
    hintText: 'Select',
    showDisabledOptions: true,
    isDisabled: false,
    isHidingCurrentValue: true
  },
}
