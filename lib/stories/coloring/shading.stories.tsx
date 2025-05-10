import type { Meta, StoryObj } from '@storybook/react'
import type { ShadedColors } from '../../coloring/types'
import { shadingColorValues } from '../../coloring/types'
import { generateShadingColors } from '../../coloring/shading'

type StripeProps = {
  shading: Partial<ShadedColors>,
};

const ColorStripe = ({ shading }: StripeProps) => {
  const shades = generateShadingColors(shading)

  return (
    <div className="row">
      {shadingColorValues.map((shade, index) => (
        <div key={index} className="col gap-y-2 items-center relative">
          <span className="font-bold">{shade}</span>
          <div
            style={{
              backgroundColor: shades[shade],
              width: 60,
              height: 60,
            }}
          />
          <span style={{ position: 'absolute', bottom: index % 2 === 0 ? '-24px' : '-48px' }}>{shades[shade].toUpperCase()}</span>
        </div>
      ))}
    </div>
  )
}

const meta = {
  title: 'Coloring/Shading',
  component: ColorStripe,
} satisfies Meta<typeof ColorStripe>

export default meta
type Story = StoryObj<typeof meta>;

export const ShadingWithFixedValues: Story = {
  args: {
    shading: {
      100: '#F5E2FD',
      200: '#EFD5FB',
      300: '#CDAFEF',
      400: '#AA96DF',
      500: '#B275CE',
      600: '#8E75CE',
      700: '#694BB4',
      800: '#8070A9',
      900: '#5D4D80',
    },
  },
}
