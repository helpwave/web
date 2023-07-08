import { Meta } from '@storybook/react'
import type { StoryObj } from '@storybook/react'

import { HelpwaveSpinner } from '../icons/HelpwaveSpinner'

// 👇 This default export determines where your story goes in the story list
const meta = {
  /* 👇 The title prop is optional.
     * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
     * to learn how to generate automatic titles
     */
  title: 'Spinner',
  component: HelpwaveSpinner,
} satisfies Meta<typeof HelpwaveSpinner>

export default meta
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    color: "#8070A9",
    animate: true,
    width: 128,
    height: 128,
  },
}
