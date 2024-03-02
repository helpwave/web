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
    color1: 'hw-primary-700',
    color2: 'hw-primary-500',
    color3: 'hw-primary-400',
    waveWidth: 10,
    waveBaseColor: 'white',
    sizeCircle1: 100,
    sizeCircle2: 200,
    sizeCircle3: 300
  },
}
