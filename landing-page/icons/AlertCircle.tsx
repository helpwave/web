import React, { forwardRef } from 'react'
import type { SVGProps } from 'react'

export default forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(function AlertCircle(props, ref) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke="currentColor" ref={ref} {...props}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  )
})
