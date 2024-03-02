import type { Meta, StoryObj } from '@storybook/react'
import Title from '../../components/examples/Title'

const meta = {
  title: 'Other/Translation',
  component: Title,
} satisfies Meta<typeof Title>

export default meta
type Story = StoryObj<typeof meta>;

export const Translation: Story = {
  args: {
    name: 'Max Mustermann',
    language: 'en'
  }
}
