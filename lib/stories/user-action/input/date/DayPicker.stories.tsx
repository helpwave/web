import type { Meta, StoryObj } from '@storybook/react'
import { DayPickerExample } from '../../../../components/examples/date/DayPickerExample'

const meta = {
  title: 'User-Action/Input/Date',
  component: DayPickerExample,
} satisfies Meta<typeof DayPickerExample>

export default meta
type Story = StoryObj<typeof meta>;

export const DayPickerVariation: Story = {
  args: {
    value: new Date(),
    selected: new Date(),
    markToday: true,
    weekStart: 'monday',
    className: 'h-max-[300px]'
  },
}
