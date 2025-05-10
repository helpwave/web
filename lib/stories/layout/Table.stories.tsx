import type { Meta, StoryObj } from '@storybook/react'
import { Table } from '../../components/Table'
import type { DataType } from '../../components/examples/TableExample'
import TableExample, { exampleData } from '../../components/examples/TableExample'

const meta: Meta<typeof Table<DataType>> = {
  title: 'Layout/Table',
  component: Table,
}

export default meta
type Story = StoryObj<typeof meta>;

export const TableExampleStory: Story = {
  render: (args) => <TableExample data={args['data']}/>,
  args: {
    data: exampleData,
  }
}
