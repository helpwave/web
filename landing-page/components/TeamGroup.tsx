import { tw } from '@helpwave/common/twind'
import type { TeamMemberProps } from './TeamMember'
import TeamMember from './TeamMember'

export type TeamGroupProps = {
  name: string,
  members: TeamMemberProps[]
}

const TeamGroup = ({
  name,
  members,
}: TeamGroupProps) => {
  return (
    <div className={tw('mb-8 flex flex-wrap text-center justify-center')}>
      <h2 className={tw('w-full text-6xl underline my-8')}>{name}</h2>
      {members.map(member => (
        <TeamMember key={member.name} {...member}/>
      ))}
    </div>
  )
}

export default TeamGroup
