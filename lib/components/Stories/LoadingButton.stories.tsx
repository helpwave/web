import type { Meta, StoryObj } from '@storybook/react'

import { LoadingButton } from '../LoadingButton'

// 👇 This default export determines where your story goes in the story list
const meta = {
  /* 👇 The title prop is optional.
     * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
     * to learn how to generate automatic titles
     */
  title: 'LoadingButton',
  component: LoadingButton,
} satisfies Meta<typeof LoadingButton>

export default meta
type Story = StoryObj<typeof meta>;

export const LoadingButtonTestVariation: Story = {
  args: {
    // 👇 The args you need here will depend on your component
    children: 'Modify my `isLoading` property',
    color: 'accent',
    variant: 'primary',
    size: 'medium',
    disabled: false,
    className: 'rounded',
  },
}
