import React, { forwardRef } from 'react'
import type { SVGProps } from 'react'

export default forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(function ChevronLast(props, ref) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ref={ref} {...props}>
      <polyline points="7 18 13 12 7 6"/>
      <path d="M17 6v12"/>
    </svg>
  )
})
