import type { Meta, StoryObj } from '@storybook/react'
import { DateTimePicker } from '../user-input/DateAndTimePicker'
import { addDuration, subtractDuration } from '../../util/date'

const meta = {
  title: 'Input',
  component: DateTimePicker,
} satisfies Meta<typeof DateTimePicker>

export default meta
type Story = StoryObj<typeof meta>;

export const DateTimePickerVariation: Story = {
  args: {
    mode: 'dateTime',
    value: new Date(),
    start: subtractDuration(new Date(), { years: 50 }),
    end: addDuration(new Date(), { years: 50 }),
  },
}
