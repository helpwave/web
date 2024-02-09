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

  const firstClose = text.indexOf(close, firstOpen)
  if (firstClose === -1) {
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
            {text.substring(firstMarker + marker.id.length + 2, firstClose)}
          </span>
          {text.length > firstClose + 1 ? (<MarkdownInterpreter text={text.substring(firstClose + 1)}/>) : null}
        </>
      )
    }
  }

  return <span>{text}</span>
}
