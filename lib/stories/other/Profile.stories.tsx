import type { Meta, StoryObj } from '@storybook/react'
import { Profile } from '../../components/Profile'
import { Helpwave } from '../../components/icons/Helpwave'
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
    return (<Profile {...args}/>)
  },
  args: {
    name: 'helpwave Member',
    role: 'Chief Executive Officer',
    roleBadge: 'CEO',
    imageUrl: 'https://cdn.helpwave.de/boringavatar.svg',
    badge: (
      <Chip className="row gap-x-2 items-center justify-center" color="dark">
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
