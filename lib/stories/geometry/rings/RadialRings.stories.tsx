import type { Meta, StoryObj } from '@storybook/react'
import { RadialRings } from '../../../components/Ring'

const meta = {
  title: 'Geometry/Rings',
  component: RadialRings,
} satisfies Meta<typeof RadialRings>

export default meta
type Story = StoryObj<typeof meta>;

export const RadialRingsVariation: Story = {
  args: {
    waveWidth: 10,
    sizeCircle1: 100,
    sizeCircle2: 200,
    sizeCircle3: 300
  },
}
