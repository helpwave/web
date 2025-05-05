import type { Meta, StoryObj } from '@storybook/react'
import { MultiSelectExample } from '../../../../components/examples/MultiSelectExample'
import { action } from '@storybook/addon-actions'

const meta = {
  title: 'User-Action/Input/Select',
  component: MultiSelectExample,
} satisfies Meta<typeof MultiSelectExample>

export default meta
type Story = StoryObj<typeof meta>;

export const MultiSelectVariations: Story = {
  args: {
    label: { name: 'Select-Label' },
    options: [
      { value: '1', selected: false, label: 'Entry 1' },
      { value: '2', selected: false, label: 'Entry 2', disabled: true },
      { value: '3', selected: false, label: 'Different Entry 3' },
      { value: '4', selected: false, label: 'Custom styled Entry 4', className: '!text-red-400' },
      { value: '5', selected: false, label: 'Entry 5' },
      { value: '6', selected: false, label: 'Entry 6', disabled: true },
      { value: '7', selected: false, label: 'Long Entry 7' },
      { value: '8', selected: false, label: 'Long Entry 8' },
      { value: '9', selected: false, label: 'Very Long Entry 9' },
      { value: '10', selected: false, label: 'Long Entry 10' },
      { value: '11', selected: false, label: 'Very very Long Entry 11' },
      { value: '12', selected: false, label: 'Entry 12', disabled: true }
    ],
    disabled: false,
    hintText: undefined,
    showDisabledOptions: true,
    useChipDisplay: true,
    enableSearch: false,
    className: '',
    triggerClassName: '',
    onChange: action('onChange'),
  },
}
