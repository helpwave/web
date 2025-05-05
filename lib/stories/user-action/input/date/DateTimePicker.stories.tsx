import type { Meta, StoryObj } from '@storybook/react'
import { DateTimePickerExample } from '../../../../components/examples/date/DateTimePickerExample'
import { addDuration, subtractDuration } from '../../../../util/date'

const meta = {
  title: 'User-Action/Input/Date',
  component: DateTimePickerExample,
} satisfies Meta<typeof DateTimePickerExample>

export default meta
type Story = StoryObj<typeof meta>;

export const DateTimePickerVariation: Story = {
  args: {
    mode: 'dateTime',
    value: new Date(),
    start: subtractDuration(new Date(), { years: 50 }),
    end: addDuration(new Date(), { years: 50 }),
    is24HourFormat: true,
    minuteIncrement: '5min',
    weekStart: 'monday',
    initialDisplay: 'day',
    markToday: true,
    showValueOpen: false,
  },
}
