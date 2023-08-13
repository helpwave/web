import type { Meta, StoryObj } from '@storybook/react'

import { Helpwave } from '../icons/Helpwave'

// 👇 This default export determines where your story goes in the story list
const meta = {
  /* 👇 The title prop is optional.
     * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
     * to learn how to generate automatic titles
     */
  title: 'Logo',
  component: Helpwave,
} satisfies Meta<typeof Helpwave>

export default meta
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    width: 128,
    height: 128,
  },
}

export const Spinner: Story = {
  args: {
    color: '#8070A9',
    animate: 'loading',
    width: 128,
    height: 128,
  },
}
