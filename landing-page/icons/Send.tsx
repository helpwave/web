import React, { forwardRef } from 'react'
import type { SVGProps } from 'react'

export default forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(function Send(props, ref) {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" ref={ref} {...props}>
      <line stroke="currentColor" x1="22" y1="2" x2="11" y2="13"></line>
      <polygon stroke="currentColor" points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  )
})
