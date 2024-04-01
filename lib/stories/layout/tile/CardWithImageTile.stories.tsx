import type { Meta, StoryObj } from '@storybook/react'
import { tw } from '@twind/core'
import { Tile } from '../../../components/layout/Tile'
import { Helpwave } from '../../../icons/Helpwave'
import { MarkdownInterpreter } from '../../../components/MarkdownInterpreter'

type SimplifiedTileType = {
  name: string,
  description: string
}

const SimplifiedTile = ({ name, description }: SimplifiedTileType) => { return <div id={name + description}/> }

const meta = {
  title: 'Layout/Tile',
  component: SimplifiedTile,
} satisfies Meta<typeof SimplifiedTile>

export default meta
type Story = StoryObj<typeof meta>;

export const CardWithImageVariation: Story = {
  render: ({ name, description }: SimplifiedTileType) => {
    return (
      <Tile
        title={{ value: name, type: 'title' }}
        description={{ value: description, type: 'normal', className: 'font-light' }}
        className={tw('bg-sky-900 text-white rounded-2xl py-8 px-8 min-h-[200px] !gap-x-8')}
        prefix={(
          <div className={tw('flex flex-row w-2/5 justify-center items-center text-2xl')}>
            <Helpwave size={48}/>
            <MarkdownInterpreter text={'\\helpwave'}/>
          </div>
        )}
      />
    )
  },
  args: {
    name: 'About helpwave',
    description: 'Regulatory burdens and high barriers to entry make it difficult for small companies to enter the market,' +
      ' leading to a lack of competition. helpwave is here to change that. We offer a platform that brings everyone to' +
      ' the table, not just the big companies.',
  },
}
