import type { Meta, StoryObj } from '@storybook/react'
import { SelectExample } from '../../../../components/examples/SelectExample'

const meta = {
  title: 'User-Action/Input/Select',
  component: SelectExample<string>,
} satisfies Meta<typeof SelectExample<string>>

export default meta
type Story = StoryObj<typeof meta>;

export const SelectVariations: Story = {
  args: {
    label: { name: 'Select-Label', labelType: 'labelMedium' },
    value: undefined,
    options: [
      { value: '1', label: 'Entry 1' },
      { value: '2', label: 'Entry 2', disabled: true },
      { value: '3', label: 'Entry 3' },
      { value: '4', label: <span className="!text-red-400">Custom styled</span> },
      { value: '5', label: 'Entry 5' },
      { value: '6', label: 'Entry 6', disabled: true }
    ],
    isDisabled: false,
    hintText: 'Hinttext',
    isHidingCurrentValue: false,
    showDisabledOptions: true,
    className: '',
  },
}
