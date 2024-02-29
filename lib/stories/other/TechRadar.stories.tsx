import type { Meta, StoryObj } from '@storybook/react'
import { TechRadar } from '../../components/TechRadar'

const meta = {
  title: 'Other/TechRadar',
  component: TechRadar,
} satisfies Meta<typeof TechRadar>

export default meta
type Story = StoryObj<typeof meta>;

export const TechRadarStory: Story = {
  render: () => <TechRadar />,
}
