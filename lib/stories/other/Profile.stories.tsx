import type { Meta, StoryObj } from '@storybook/react'
import { tw } from '@twind/core'
import { Profile } from '../../components/Profile'
import { Helpwave } from '../../icons/Helpwave'
import { MarkdownInterpreter } from '../../components/MarkdownInterpreter'
import { Chip } from '../../components/ChipList'

const meta = {
  title: 'Other/Profile',
  component: Profile,
} satisfies Meta<typeof Profile>

export default meta
type Story = StoryObj<typeof meta>;

export const ProfileVariation: Story = {
  render: (args) => {
    return (<div className={tw('bg-gray-200 p-4')}><Profile {...args}/></div>)
  },
  args: {
    name: 'Helpwave Member',
    role: 'Chief Executive Officer',
    roleBadge: 'CEO',
    imageUrl: 'https://source.boringavatars.com/marble/512/Maria?square=true',
    badge: (
      <Chip className={tw('flex flex-row gap-x-2 items-center justify-center')} color="black">
        <Helpwave size={24}/>
        <MarkdownInterpreter text={'\\helpwave'}/>
      </Chip>
    ),
    tags: ['development', 'frontend', 'cloud', 'backend'],
    info: 'This is an additional Information Text.',
    socials: [
      {
        type: 'github',
        url: 'https://github.com',
      },
      {
        type: 'mail',
        url: 'mailto:mail@helpwave.de',
      },
      {
        type: 'linkedin',
        url: 'https://www.linkedin.com/',
      },
      {
        type: 'website',
        url: 'https://helpwave.de',
      },
    ],
    imageClassName: 'w-[200px] h-[200px]'
  },
}
