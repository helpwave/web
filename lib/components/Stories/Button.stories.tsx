import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../Button'

// 👇 This default export determines where your story goes in the story list
const meta = {
  /* 👇 The title prop is optional.
     * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
     * to learn how to generate automatic titles
     */
  title: 'Button',
  component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>;

export const ButtonTestVariation: Story = {
  args: {
    // 👇 The args you need here will depend on your component
    children: 'Test',
    color: 'accent',
    variant: 'primary',
    size: 'medium',
    disabled: false,
    className: 'rounded',
    onClick: () => {
      console.log('clicked')
    }
  },
}
