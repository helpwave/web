import type { Meta, StoryObj } from '@storybook/react'
import { BreadCrumb } from '../../components/BreadCrumb'

const meta = {
  title: 'Other/BreadCrumb',
  component: BreadCrumb,
} satisfies Meta<typeof BreadCrumb>

export default meta
type Story = StoryObj<typeof meta>;

export const BreadCrumbVariation: Story = {
  args: {
    crumbs: [
      { display: 'Organization', link: '' },
      { display: 'Ward', link: '' },
      { display: 'Bed', link: '' },
      { display: 'Patient', link: '' },
    ]
  },
}
