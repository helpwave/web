import type { Meta, StoryObj } from '@storybook/react'
import { AvatarGroup } from '../../../components/AvatarGroup'

const meta = {
  title: 'Other/Avatar',
  component: AvatarGroup,
} satisfies Meta<typeof AvatarGroup>

export default meta
type Story = StoryObj<typeof meta>;

export const AvatarGroupVariation: Story = {
  args: {
    avatars: [
      { alt: 'altText', avatarUrl: 'https://helpwave.de/favicon.ico' },
      { alt: 'altText', avatarUrl: 'https://helpwave.de/favicon.ico' },
      { alt: 'altText', avatarUrl: 'https://helpwave.de/favicon.ico' },
      { alt: 'altText', avatarUrl: 'https://helpwave.de/favicon.ico' },
      { alt: 'altText', avatarUrl: 'https://helpwave.de/favicon.ico' },
      { alt: 'altText', avatarUrl: 'https://helpwave.de/favicon.ico' },
      { alt: 'altText', avatarUrl: 'https://helpwave.de/favicon.ico' },
    ],
    maxShownProfiles: 5,
    size: 'tiny'
  },
}
