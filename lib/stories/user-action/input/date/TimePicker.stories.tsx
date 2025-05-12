import type { Meta, StoryObj } from '@storybook/react'
import { ControlledTimePicker } from '../../../../components/date/TimePicker'

const meta = {
  title: 'User-Action/Input/Date',
  component: ControlledTimePicker,
} satisfies Meta<typeof ControlledTimePicker>

export default meta
type Story = StoryObj<typeof meta>;

export const TimePickerVariation: Story = {
  args: {
    time: new Date(),
    is24HourFormat: true,
    minuteIncrement: '5min',
    maxHeight: 300,
    className: ''
  },
}
