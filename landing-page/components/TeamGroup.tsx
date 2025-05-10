import type { ProfileProps } from '@helpwave/common/components/Profile'
import { Profile } from '@helpwave/common/components/Profile'

export type TeamGroupProps = {
  name: string,
  members: ProfileProps[],
}

const TeamGroup = ({
  name,
  members,
}: TeamGroupProps) => {
  return (
    <div className="mb-8 flex flex-wrap text-center justify-center gap-8">
      <h2 className="w-full text-6xl underline my-8">{name}</h2>
      {members.map(member => (
        <Profile key={member.name} {...member}/>
      ))}
    </div>
  )
}

export default TeamGroup
