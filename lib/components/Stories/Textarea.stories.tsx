import type { Meta, StoryObj } from '@storybook/react'
import { TextareaExample } from '../examples/TextareaExample'

const meta = {
  title: 'Input',
  component: TextareaExample,
} satisfies Meta<typeof TextareaExample>

export default meta
type Story = StoryObj<typeof meta>;

export const TextareaVariation: Story = {
  args: {
    value: 'Text',
    label: 'Label',
    id: 'text',
    headline: '',
    disclaimer: '',
    resizable: false,
    className: '',
  },
}
