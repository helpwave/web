import { tw } from '@twind/core'
import GridBox from './GridBox'

const roles = ['Frontend Developer', 'Backend Developer', 'Backend Engineer', 'Product Owner', 'Product Manager', 'Customer Relations', 'DevOps']

type Role = typeof roles[number]

const teamMembers = [
  { name: 'Felix', role: 'Frontend Developer' },
  { name: 'Felix', role: 'Project Manager' },
  { name: 'Max', role: 'Backend Developer' },
  { name: 'Jonas', role: 'Product Owner' },
  { name: 'Jannik', role: 'Frontend Developer' },
  { name: 'Christian', role: 'Customer Relations' },
  { name: 'Max', role: 'Project Manager' },
  { name: 'Florian', role: 'Backend Developer' },
  { name: 'Nico', role: 'DevOps' }
]

// TODO: fix this using twind
const Person = ({ name, role }: { name: string, role: Role }) => (
  <div className={tw('w-48')}>
    <div className={tw('font-semibold text-4xl text-white')}>
      {name}
    </div>
    {role === 'Frontend Developer' && <div className={tw('font-medium text-xl text-[#8E75CE]')}>{role}</div>}
    {role === 'Project Manager'    && <div className={tw('font-medium text-xl text-[#7DED99]')}>{role}</div>}
    {role === 'Product Owner'      && <div className={tw('font-medium text-xl text-[#AD5461]')}>{role}</div>}
    {role === 'Customer Relations' && <div className={tw('font-medium text-xl text-[#AD5461]')}>{role}</div>}
    {role === 'Backend Developer'  && <div className={tw('font-medium text-xl text-[#AD5461]')}>{role}</div>}
    {role === 'DevOps'             && <div className={tw('font-medium text-xl text-[#FF9933]')}>{role}</div>}
  </div>
)

const TeamSection = () => {
  return (
    <div className={tw('w-screen h-screen bg-primary')}>
      <div className={tw('flex justify-end p-8')}>
        <GridBox heading={<h1 className={tw('text-white text-5xl font-space font-bold pl-4 pb-4')}>Our Team</h1>}>
          <div className={tw('w-fit grid grid-cols-2 gap-16')}>
            {teamMembers.map(({ name, role }, index) => <Person key={index} name={name} role={role} />)}
          </div>
        </GridBox>
      </div>
    </div>
  )
}

export default TeamSection
