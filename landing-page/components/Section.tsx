import type { PropsWithChildren } from 'react'
import { tw } from '@twind/core'

type Section = PropsWithChildren<{
  id: string
}>

type TitleSection = Section & {
  title: string
}

// TODO: this can interact with the carousel in the future
export const Section = ({ id, children }: Section) => {
  return (
    <div className={tw('w-screen h-screen bg-hw-temp-gray-c text-white')} id={id}>
      <div className={tw('p-32')}>
        {children}
      </div>
    </div>
  )
}

export const TitleSection = ({ title, id, children }: TitleSection) => {
  return (
    <Section id={id}>
      <h1 className={tw('text-5xl font-space font-bold pb-4')}>{title}</h1>
      {children}
    </Section>
  )
}
