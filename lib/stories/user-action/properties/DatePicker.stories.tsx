import type { Meta, StoryObj } from '@storybook/react'
import { DatePickerExample } from '../examples/date/DatePickerExample'
import { addDuration, subtractDuration } from '../../util/date'

const meta = {
  title: 'Date',
  component: DatePickerExample,
} satisfies Meta<typeof DatePickerExample>

export default meta
type Story = StoryObj<typeof meta>;

export const DatePickerVariation: Story = {
  args: {
    value: new Date(),
    start: subtractDuration(new Date(), { years: 50 }),
    end: addDuration(new Date(), { years: 50 }),
    initialDisplay: 'day',
    className: '',
    yearMonthPickerProps: {},
    dayPickerProps: {},
  },
}
