import type { Meta, StoryObj } from '@storybook/react'

import { Card } from './Card'

// 👇 This default export determines where your story goes in the story list
const meta = {
  /* 👇 The title prop is optional.
     * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
     * to learn how to generate automatic titles
     */
  title: 'Card',
  component: Card,
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>;

export const CardTestVariation: Story = {
  args: {
    // 👇 The args you need here will depend on your component
    isSelected: true,
    onTileClick: () => {
      console.log('clicked')
    },
    className: 'rounded',
    children: <div>Testing Card</div>
  },
}
