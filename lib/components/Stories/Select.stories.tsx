import type { Meta, StoryObj } from '@storybook/react'
import { Span } from '../Span'
import { SelectExample } from '../examples/SelectExample'

const meta = {
  title: 'Select',
  component: SelectExample<string>,
} satisfies Meta<typeof SelectExample<string>>

export default meta
type Story = StoryObj<typeof meta>;

export const SelectVariations: Story = {
  args: {
    label: 'Select-Label',
    value: undefined,
    options: [
      { value: '1', label: 'Entry 1' },
      { value: '2', label: 'Entry 2', disabled: true },
      { value: '3', label: 'Entry 3' },
      { value: '4', label: <Span className="!text-red-400">Custom styled</Span> },
      { value: '5', label: 'Entry 5' },
      { value: '6', label: 'Entry 6', disabled: true }
    ],
    isDisabled: false,
    hintText: 'Hinttext',
    isHidingCurrentValue: false,
    showDisabledOptions: true,
    labelType: 'labelBig',
    className: '',
  },
}
