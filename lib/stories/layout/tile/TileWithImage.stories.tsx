import type { Meta, StoryObj } from '@storybook/react'
import { TileWithImage } from '../../../components/layout/Tile'

const meta = {
  title: 'Layout/Tile',
  component: TileWithImage,
} satisfies Meta<typeof TileWithImage>

export default meta
type Story = StoryObj<typeof meta>;

export const TileWithImageVariation: Story = {
  args: {
    title: { value: 'About helpwave', className: 'textstyle-title-lg' },
    description: {
      value: 'Regulatory burdens and high barriers to entry make it difficult for small companies to enter the market,' +
          ' leading to a lack of competition. helpwave is here to change that. We offer a platform that brings everyone to' +
        ' the table, not just the big companies.',
      className: '!text-gray-200'
    },
    url: 'https://helpwave.de/favicon.ico',
    imageLocation: 'prefix',
    imageSize: { width: 100, height: 100 },
    imageClassName: 'filter invert',
    className: '!py-4 !px-6 !gap-x-6 bg-sky-900 text-white rounded-2xl min-h-[200px]'
  },
}
