import { forwardRef } from 'react'
import type { PropsWithChildren } from 'react'
import { tw } from '@helpwave/common/twind/index'

type Section = PropsWithChildren<{ id?: string }>

type TitleSection = Section & {
  title: string
}

// TODO: using (min-)h-screen here is bad, size it according to the content instead
export const Section = forwardRef<HTMLDivElement, Section>(function Section({ id, children }, ref) {
  return (
    <div className={tw('w-full min-h-screen bg-hw-dark-gray-600 text-white')} ref={ref} id={id}>
      <div className={tw('p-32')}>{children}</div>
    </div>
  )
})

export const TitleSection = forwardRef<HTMLDivElement, TitleSection>(function TitleSection({ title, id, children }, ref) {
  return (
    <Section ref={ref} id={id}>
      <h1 className={tw('text-5xl font-space font-bold pb-4')}>{title}</h1>
      {children}
    </Section>
  )
})
