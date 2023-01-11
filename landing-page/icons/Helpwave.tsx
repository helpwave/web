import React, { forwardRef } from 'react'
import type { SVGProps } from 'react'

export default forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(function Helpwave(props, ref) {
  return (
    <svg width="1024" height="1024" fill="white" viewBox="0 0 640 640" ref={ref} {...props}>
      <path d="M287 538.079V163.122" stroke="white" strokeWidth="25" strokeLinecap="round"/>
      <path d="M335 537.994L335 130.99" stroke="white" strokeWidth="25" strokeLinecap="round"/>
      <path d="M215 488.725L287 163.122" stroke="white" strokeWidth="25" strokeLinecap="round"/>
      <path d="M215 488.725L174 263.802" stroke="white" strokeWidth="25" strokeLinecap="round"/>
      <path d="M147 405.182L174 263.802" stroke="white" strokeWidth="25" strokeLinecap="round"/>
      <path d="M147 405.182H92" stroke="white" strokeWidth="25" strokeLinecap="round"/>
      <path d="M384 212.391V105.284" stroke="white" strokeWidth="25" strokeLinecap="round"/>
      <path d="M384 537.994V452.309" stroke="white" strokeWidth="25" strokeLinecap="round"/>
      <path d="M439 181.33V101" stroke="white" strokeWidth="25" strokeLinecap="round"/>
      <path d="M439 537.994L439.244 471.053" stroke="white" strokeWidth="25" strokeLinecap="round"/>
      <path d="M493 190.969V105.284" stroke="white" strokeWidth="25" strokeLinecap="round"/>
      <path d="M545 244.523V158.837" stroke="white" strokeWidth="25" strokeLinecap="round"/>
      <path d="M596 265.944V223.101" stroke="white" strokeWidth="25" strokeLinecap="round"/>
      <path d="M545 537.994H596" stroke="white" strokeWidth="25" strokeLinecap="round"/>
      <path d="M493 537.994V500.507" stroke="white" strokeWidth="25" strokeLinecap="round"/>
      <ellipse cx="69" cy="403.04" rx="25" ry="26.7766" fill="white"/>
    </svg>
  )
})
