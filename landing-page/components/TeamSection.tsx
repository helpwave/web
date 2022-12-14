import type { PropsWithChildren, ReactNode } from 'react'

const roles = ['Frontend Developer', 'Backend Developer', 'Backend Engineer', 'Product Owner', 'Product Manager', 'Customer Relations', 'DevOps']

type Role = typeof roles[number]

const teamMembers = [
  { name: 'Felix', role: 'Frontend Developer' },
  { name: 'Felix', role: 'Product Manager' },
  { name: 'Max', role: 'Backend Developer' },
  { name: 'Jonas', role: 'Product Owner' },
  { name: 'Jannik', role: 'Frontend Developer' },
  { name: 'Christian', role: 'Customer Relations' },
  { name: 'Max', role: 'Backend Engineer' },
  { name: 'Florian', role: 'Backend Developer' },
  { name: 'Nico', role: 'DevOps' }
]

const Person = ({ name, role }: { name: string, role: Role }) => (
  <div className="w-48">
    <div className="font-semibold text-4xl text-white">
      {name}
    </div>
    {role === 'Frontend Developer' && <div className="font-medium text-xl text-[#8E75CE]">{role}</div>}
    {role === 'Product Manager' && <div className="font-medium text-xl text-[#7DED99]">{role}</div>}
    {role === 'Product Owner' && <div className="font-medium text-xl text-[#AD5461]">{role}</div>}
    {role === 'Customer Relations' && <div className="font-medium text-xl text-[#AD5461]">{role}</div>}
    {role === 'Backend Developer' && <div className="font-medium text-xl text-[#AD5461]">{role}</div>}
    {role === 'Backend Engineer' && <div className="font-medium text-xl text-[#AD5461]">{role}</div>}
    {role === 'DevOps' && <div className="font-medium text-xl text-[#FF9933]">{role}</div>}
  </div>
)

const GridBox = ({ children, heading }: PropsWithChildren<{ heading?: ReactNode }>) => (
  <div className="relative w-fit p-14">
    {heading && (
      <div className="absolute inset-x-14 inset-y-0 z-1">{heading}</div>
    )}
    <div className="absolute inset-x-0  inset-y-14 border-t-2 border-b-2 border-dashed border-[#8E75CE] z-0 pointer-events-none"></div>
    <div className="absolute inset-x-14 inset-y-0  border-l-2 border-r-2 border-dashed border-[#8E75CE] z-0 pointer-events-none"></div>
    <div className="relative border-2 rounded-[32px] border-[#4F3879] p-9 z-1">
      {children}
    </div>
  </div>
)

const TeamSection = () => {
  return (
    <div className="w-screen h-screen bg-primary">
      <div className="flex justify-end p-8">
        <GridBox heading={<h1 className="text-white text-5xl font-space font-bold pl-4 pb-4">Our Team</h1>}>
          <div className="w-fit grid grid-cols-2 gap-16">
            {teamMembers.map(({ name, role }, index) => <Person key={index} name={name} role={role} />)}
          </div>
        </GridBox>
      </div>
    </div>
  )
}

export default TeamSection
