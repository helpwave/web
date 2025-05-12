import type { Meta, StoryObj } from '@storybook/react'
import clsx from 'clsx'
import { PropertyBase } from '../../../components/properties/PropertyBase'

const meta = {
  title: 'User-Action/Property',
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
        className={clsx('row grow py-2 px-4', { 'text-warning': softRequired && !hasValue })}
      >
        Value
      </div>
    ),
    className: '',
    readOnly: false,
  },
}
