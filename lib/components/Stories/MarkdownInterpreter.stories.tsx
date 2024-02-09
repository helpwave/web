import type { Meta, StoryObj } from '@storybook/react'
import { MarkdownInterpreter } from '../MarkdownInterpreter'

const meta = {
  title: 'MarkdownInterpreter',
  component: MarkdownInterpreter,
} satisfies Meta<typeof MarkdownInterpreter>

export default meta
type Story = StoryObj<typeof meta>;

export const MarkdownInterpreterVariation: Story = {
  args: {
    text: '\\helpwave \\i{italic} \\{Escape\\} \\\\ \\b{bold} \\u{underline} \\space{space-grotesk}',
    commandStart: '\\',
    close: '}',
    open: '{'
  },
}
