import type { Meta, StoryObj } from '@storybook/react'
import { InputGroupExample } from '../../examples/InputGroupExample'

const meta = {
  title: 'Layout',
  component: InputGroupExample,
} satisfies Meta<typeof InputGroupExample>

export default meta
type Story = StoryObj<typeof meta>;

export const InputGroupVariation: Story = {
  args: {
    title: 'Title',
    expanded: true,
    isExpandable: true,
    className: '',
  },
}
