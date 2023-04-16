import React, { forwardRef } from 'react'
import type { SVGProps } from 'react'

export default forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(function Edit(props, ref) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      ref={ref}
      {...props}
    >
      <line x1="18" x2="22" y1="2" y2="6"/>
      <path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"/>
    </svg>
  )
})
