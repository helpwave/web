import type { Meta, StoryObj } from '@storybook/react'
import { SearchableSelectExample } from '../../../../components/examples/SearchableSelectExample'
import { action } from '@storybook/addon-actions'

const meta = {
  title: 'User-Action/Input/Select',
  component: SearchableSelectExample,
} satisfies Meta<typeof SearchableSelectExample>

export default meta
type Story = StoryObj<typeof meta>;

export const SearchableSelectVariations: Story = {
  args: {
    label: { name: 'Select-Label', labelType: 'labelMedium' },
    value: undefined,
    options: [
      { value: 'Entry 1', label: 'Entry 1' },
      { value: 'Entry 2', label: 'Entry 2', disabled: true },
      { value: 'Entry 3', label: 'Entry 3' },
      { value: 'Custom styled', label: <span className="!text-red-400">Custom styled</span> },
      { value: 'Entry 5', label: 'Entry 5' },
      { value: 'Entry 6', label: 'Entry 6', disabled: true }
    ],
    isDisabled: false,
    hintText: 'Hinttext',
    isHidingCurrentValue: false,
    showDisabledOptions: true,
    className: '',
    onChange: action('onChange'),
  },
}
