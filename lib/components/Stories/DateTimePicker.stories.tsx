import type { Meta, StoryObj } from '@storybook/react'
import { addDuration, subtractDuration } from '../../util/date'
import { DateTimePickerExample } from '../examples/date/DateTimePickerExample'

const meta = {
  title: 'Date',
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
  },
}
