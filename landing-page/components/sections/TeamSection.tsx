import { forwardRef } from 'react'
import { tw } from '@twind/core'
import GridBox from '../GridBox'
import { Section } from '../Section'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'

const roles = { /* eslint-disable key-spacing, no-multi-spaces */
  FRONTEND_DEVELOPER: { id: 'FRONTEND_DEVELOPER', name: 'Frontend Developer', color: 'hw-primary-300' },
  BACKEND_DEVELOPER:  { id: 'BACKEND-DEVELOPER',  name: 'Backend Developer',  color: 'hw-pool-red'    },
  PRODUCT_OWNER:      { id: 'PRODUCT_OWNER',      name: 'Product Owner',      color: 'hw-pool-green'  },
  PRODUCT_MANAGER:    { id: 'PRODUCT_MANAGER',    name: 'Product Manager',    color: 'hw-pool-green'  },
  CUSTOMER_RELATIONS: { id: 'CUSTOMER_RELATIONS', name: 'Customer Relations', color: 'hw-pool-green'  },
  DEVOPS:             { id: 'DEVOPS',             name: 'DevOps',             color: 'hw-pool-orange' },
} /* eslint-enable key-spacing, no-multi-spaces */

type Role = keyof typeof roles

const roleEnum = Object.fromEntries(Object.keys(roles).map((key) => [key, key])) as { [key in Role]: key }

const teamMembers = [ /* eslint-disable key-spacing, no-multi-spaces */
  { name: 'Felix',     role: roleEnum.FRONTEND_DEVELOPER },
  { name: 'Felix',     role: roleEnum.PRODUCT_MANAGER },
  { name: 'Max',       role: roleEnum.BACKEND_DEVELOPER },
  { name: 'Jonas',     role: roleEnum.PRODUCT_OWNER },
  { name: 'Jannik',    role: roleEnum.FRONTEND_DEVELOPER },
  { name: 'Christian', role: roleEnum.CUSTOMER_RELATIONS },
  { name: 'Max',       role: roleEnum.BACKEND_DEVELOPER },
  { name: 'Florian',   role: roleEnum.BACKEND_DEVELOPER },
  { name: 'Nico',      role: roleEnum.DEVOPS }
] /* eslint-enable key-spacing, no-multi-spaces */

export type TeamSectionLanguage = {
  heading: string
}

const defaultTeamSectionTranslations: Record<Languages, TeamSectionLanguage> = {
  en: {
    heading: 'Our Team',
  },
  de: {
    heading: 'Unser Team',
  }
}

const Person = ({ name, role }: { name: string, role: Role }) => (
  <div className={tw('w-48')}>
    <div className={tw('font-semibold text-4xl text-white')}>
      {name}
    </div>
    <div className={tw(`font-medium text-xl text-${roles[role].color}`)}>{roles[role].name}</div>
  </div>
)

const TeamSection = forwardRef<HTMLDivElement, PropsWithLanguage<TeamSectionLanguage, Record<string, unknown>>>(function TeamSection(props, ref) {
  const language = useTranslation(props.language, defaultTeamSectionTranslations)
  return (
    <Section ref={ref} id="team">
      <div className={tw('flex justify-end')}>
        <GridBox heading={<h1 className={tw('text-white text-5xl font-space font-bold pl-4 pb-4')}>{language.heading}</h1>}>
          <div className={tw('w-fit grid grid-cols-2 gap-16')}>
            {teamMembers.map(({ name, role }, index) => <Person key={index} name={name} role={role} />)}
          </div>
        </GridBox>
      </div>
      </Section>
  )
})

export default TeamSection
