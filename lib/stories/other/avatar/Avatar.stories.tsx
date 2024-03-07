import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from '../../../components/Avatar'

const meta = {
  title: 'Other/Avatar',
  component: Avatar,
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>;

export const AvatarVariation: Story = {
  args: {
    alt: 'altText',
    avatarUrl: 'https://helpwave.de/favicon.ico',
    size: 'small',
    className: ''
  },
}
