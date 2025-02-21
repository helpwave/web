import type { PropsWithChildren } from 'react';
import { tx } from '@twind/core';


export type SectionProps = PropsWithChildren<{ className?: string }>

/**
 * Description
 */
export const Section = ({ children, className }: SectionProps) => {
  return (<div className={tx('@(flex flex-col section-padding gap-y-2)', className)}>{children}</div>)
}
