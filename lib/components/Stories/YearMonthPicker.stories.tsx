import type { Meta, StoryObj } from '@storybook/react'
import { YearMonthPickerExample } from '../examples/date/YearMonthPickerExample'
import { addDuration, subtractDuration } from '../../util/date'

const meta = {
  title: 'Date',
  component: YearMonthPickerExample,
} satisfies Meta<typeof YearMonthPickerExample>

export default meta
type Story = StoryObj<typeof meta>;

export const YearMonthPickerVariation: Story = {
  args: {
    value: new Date(),
    startYear: subtractDuration(new Date(), { years: 50 }),
    endYear: addDuration(new Date(), { years: 50 }),
    className: 'max-h-[300px] max-w-[200px]'
  },
}
