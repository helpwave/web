import type { Meta, StoryObj } from '@storybook/react'
import { SearchableList } from '../../components/SearchableList'
import { Span } from '../../components/Span'

const meta = {
  title: 'Other/SearchableList',
  component: SearchableList<string>,
} satisfies Meta<typeof SearchableList<string>>

export default meta
type Story = StoryObj<typeof meta>;

export const SearchableListVariation: Story = {
  args: {
    list: ['Apple', 'Banana', 'Pineapple', 'Pear', 'Strawberry', 'Raspberry', 'Wildberry'],
    initialSearch: '',
    searchMapping: value => [value],
    itemMapper: value => <Span>{value}</Span>,
    className: '',
    overwriteTranslation: {},
  },
}
