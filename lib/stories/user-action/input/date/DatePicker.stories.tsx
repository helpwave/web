import type { Meta, StoryObj } from '@storybook/react'
import { addDuration, subtractDuration } from '../../../../util/date'
import { ControlledDatePicker } from '../../../../components/date/DatePicker'

const meta = {
  title: 'User-Action/Input/Date',
  component: ControlledDatePicker,
} satisfies Meta<typeof ControlledDatePicker>

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
