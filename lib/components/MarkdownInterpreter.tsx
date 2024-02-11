import type { ReactNode } from 'react'
import { tw } from '../twind'

export type MarkdownInterpreterProps = {
  text: string,
  commandStart?: string,
  open?: string,
  close?: string
}

type Marker = {
  id: string,
  className: string
}

type Replace = {
  id: string,
  replacement: string | ReactNode
}

const markers: Marker[] = [
  {
    id: 'i',
    className: 'italic'
  },
  {
    id: 'b',
    className: 'font-bold'
  },
  {
    id: 'u',
    className: 'underline'
  },
  {
    id: 'space',
    className: 'font-space'
  },
  {
    id: 'primary',
    className: 'text-hw-primary-400'
  },
  {
    id: 'warn',
    className: 'text-hw-warn-400'
  },
  {
    id: 'positive',
    className: 'text-hw-positive-400'
  },
  {
    id: 'negative',
    className: 'text-hw-negative-400'
  },
]

const replacements: Replace[] = [
  {
    id: 'helpwave',
    replacement: (<span className={tw('font-bold font-space no-underline')}>helpwave</span>)
  },
]

export const MarkdownInterpreter = ({
  text,
  commandStart = '\\',
  open = '{',
  close = '}'
}: MarkdownInterpreterProps) => {
  const firstMarker = text.indexOf(commandStart)
  const usedReplacements: Replace[] = [
    ...replacements,
    {
      id: commandStart,
      replacement: commandStart,
    },
    {
      id: open,
      replacement: open,
    },
    {
      id: close,
      replacement: close,
    }
  ]

  // does not contain a command
  if (firstMarker === -1 || firstMarker + 1 >= text.length) {
    return <span>{text}</span>
  }

  const afterMarker = text.substring(firstMarker + 1)
  // check for matching replacements
  for (const replacement of usedReplacements) {
    if (firstMarker + replacement.id.length < text.length && afterMarker.startsWith(replacement.id)) {
      return (
        <>
          {text.substring(0, firstMarker)}
          {replacement.replacement}
          <MarkdownInterpreter text={text.substring(firstMarker + replacement.id.length + 1)}/>
        </>
      )
    }
  }

  const firstOpen = text.indexOf(open, firstMarker)
  if (firstOpen === -1) {
    return <span>{text}</span>
  }

  let closing = -1
  let index = firstOpen + 1
  let counter = 1
  let escaping = false
  while (index < text.length) {
    if (text[index] === open && !escaping) {
      counter++
    }
    if (text[index] === close && !escaping) {
      counter--
      if (counter === 0) {
        closing = index
        break
      }
    }
    escaping = text[index] === commandStart
    index++
  }
  if (closing === -1) {
    return <span>{text}</span>
  }

  // check for matching replacements
  for (const marker of markers) {
    if (
      afterMarker.startsWith(marker.id) &&
      firstMarker + marker.id.length <= text.length
    ) {
      return (
        <>
          {text.substring(0, firstMarker)}
          <span className={tw(marker.className)}>
            <MarkdownInterpreter text={text.substring(firstMarker + marker.id.length + 2, closing)}/>
          </span>
          {text.length > closing + 1 ? (<MarkdownInterpreter text={text.substring(closing + 1)}/>) : null}
        </>
      )
    }
  }

  return <span>{text}</span>
}
