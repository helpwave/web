import React, { forwardRef } from 'react'
import type { SVGProps } from 'react'

export default forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(function Check(props, ref) {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeWidth="2" ref={ref} {...props}>
      <polyline stroke="currentColor" points="20 6 9 17 4 12"></polyline>
    </svg>
  )
})
