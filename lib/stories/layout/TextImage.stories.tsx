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
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    contentClassName: '',
    className: '',
  },
}
