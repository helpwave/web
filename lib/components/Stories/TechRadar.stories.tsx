import type { Meta, StoryObj } from '@storybook/react'
import { TechRadar } from '../TechRadar'

const meta = {
  title: 'TechRadar',
  component: TechRadar,
} satisfies Meta<typeof TechRadar>

export default meta
type Story = StoryObj<typeof meta>;

export const TechRadarStory: Story = {
  render: () => <TechRadar />,
}
