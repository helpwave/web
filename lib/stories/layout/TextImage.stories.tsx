import type { Meta, StoryObj } from '@storybook/react'
import { TextImage } from '../../components/TextImage'

const meta = {
  title: 'Layout/TextImage',
  component: TextImage,
} satisfies Meta<typeof TextImage>

export default meta
type Story = StoryObj<typeof meta>;

export const TextImageVariation: Story = {
  args: {
    title: 'This is the title',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras magna lorem, eleifend at mi nec, ' +
      'vehicula dignissim diam. Integer ut justo eget neque interdum viverra eu eu dolor. Nullam vulputate urna sed ' +
      'gravida facilisis. Phasellus volutpat elit luctus, sagittis libero sit amet, dapibus lacus.',
    color: 'primary',
    badge: 'Step #1',
    imageUrl: 'https://source.boringavatars.com/marble/2048/Maria?square=true',
    imageClassName: '',
    contentClassName: '',
    className: '',
  },
}
