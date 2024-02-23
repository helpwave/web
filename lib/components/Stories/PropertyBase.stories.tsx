import type { Meta, StoryObj } from '@storybook/react'
import { PropertyBase } from '../properties/PropertyBase'
import { tx } from '../../twind'

const meta = {
  title: 'Property',
  component: PropertyBase,
} satisfies Meta<typeof PropertyBase>

export default meta
type Story = StoryObj<typeof meta>;

export const PropertyBaseVariation: Story = {
  args: {
    name: 'Property',
    softRequired: false,
    hasValue: true,
    input: ({ softRequired, hasValue }) => (
      <div
        className={tx('flex flex-row grow py-2 px-4', { 'text-hw-warn-600': softRequired && !hasValue })}
      >
        Value
      </div>
    ),
    className: '',
  },
}
