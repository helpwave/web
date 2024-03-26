import type { Meta, StoryObj } from '@storybook/react'
import { TimePickerExample } from '../../../../components/examples/date/TimePickerExample'

const meta = {
  title: 'User-Action/Input/Date',
  component: TimePickerExample,
} satisfies Meta<typeof TimePickerExample>

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
