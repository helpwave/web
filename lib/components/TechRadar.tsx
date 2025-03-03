import { useEffect, useState } from 'react'
import Script from 'next/script'

type Config = {
  colors: {
    background: string, // hex
    grid: string, // hex
    inactive: string, // hex
  },
  title: string,
  quadrants: {
    name: string,
  }[],
  rings: {
    name: string,
    color: string, // hex
  }[],
  print_layout: boolean,
  links_in_new_tabs: boolean,
  zoomed_quadrant?: 0 | 1 | 2 | 3,
}

type Entry = {
  label: string,
  link?: string,
  active: boolean,
  quadrant: 0 | 1 | 2 | 3, // Clockwise, starts from bottom right
  ring: 0 | 1 | 2 | 3, // Starts from the inside
  moved: -1 | 0 | 1, // -1: moved out, 0: not moved, 1: moved in
}

const helpwaveTechRadar = {
  date: new Date('1/28/2024'),
  config: {
    colors: {
      background: '#fff',
      grid: '#dddde0',
      inactive: '#ddd'
    },
    title: 'helpwave Tech-Radar',
    quadrants: [
      { name: 'Languages' },
      { name: 'Language dependencies' },
      { name: 'Infrastructure' },
      { name: 'Datastores' },
    ],
    rings: [
      { name: 'ADOPT', color: '#5ba300' },
      { name: 'TRIAL', color: '#009eb0' },
      { name: 'ASSESS', color: '#c7ba00' },
      { name: 'HOLD', color: '#e09b96' }
    ],
    print_layout: true,
    links_in_new_tabs: true,
  } satisfies Config,
  entries: [
    // Languages
    {
      label: 'Golang',
      active: true,
      quadrant: 0,
      ring: 0,
      moved: 0,
    },
    {
      label: 'Python',
      active: true,
      quadrant: 0,
      ring: 2,
      moved: 0,
    },
    {
      label: 'TypeScript',
      active: true,
      quadrant: 0,
      ring: 0,
      moved: 0,
    },
    {
      label: 'Dart',
      active: true,
      quadrant: 0,
      ring: 0,
      moved: 0,
    },
    // Language dependencies
    {
      label: 'Dapr',
      link: 'https://dapr.io/',
      active: true,
      quadrant: 1,
      ring: 0,
      moved: 0,
    },
    {
      label: 'GORM',
      active: true,
      quadrant: 1,
      ring: 3,
      moved: -1,
    },
    {
      label: 'SQLc',
      active: true,
      quadrant: 1,
      ring: 0,
      moved: 1,
    },

    {
      label: 'Flutter',
      active: true,
      quadrant: 1,
      ring: 0,
      moved: 0,
    },
    {
      label: 'Next.js',
      active: true,
      quadrant: 1,
      ring: 0,
      moved: 0,
    },
    // Infrastructure
    {
      label: 'Docker',
      active: true,
      quadrant: 2,
      ring: 0,
      moved: 0,
    },
    {
      label: 'Kubernetes',
      active: true,
      quadrant: 2,
      ring: 2,
      moved: 1,
    },
    {
      label: 'gRPC',
      active: true,
      quadrant: 2,
      ring: 0,
      moved: 0,
    },
    {
      label: 'APISIX',
      active: true,
      quadrant: 2,
      ring: 0,
      moved: 0,
    },
    {
      label: 'GitHub Actions',
      active: true,
      quadrant: 2,
      ring: 0,
      moved: 0,
    },
    {
      label: 'devenv',
      active: true,
      quadrant: 2,
      ring: 1,
      moved: 0,
    },
    // Datastores
    {
      label: 'PostgreSQL',
      active: true,
      quadrant: 3,
      ring: 0,
      moved: 0,
    },
    {
      label: 'Redis',
      active: true,
      quadrant: 3,
      ring: 0,
      moved: 0,
    },
    {
      label: 'EventStoreDB',
      active: true,
      quadrant: 3,
      ring: 1,
      moved: 0,
    },
  ] satisfies Entry[]
}

type TechRadarProps = {
  date?: Date,
  config?: Config,
  entries?: Entry[],
}

/**
 * This component wraps https://github.com/zalando/tech-radar
 */
export const TechRadar = ({
  date = helpwaveTechRadar.date,
  config = helpwaveTechRadar.config,
  entries = helpwaveTechRadar.entries,
}: TechRadarProps) => {
  const [isD3Loaded, setIsD3Loaded] = useState(false)
  const [isRadarLoaded, setIsRadarLoaded] = useState(false)

  const dateString = date.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })

  useEffect(() => {
    if (!isD3Loaded || !isRadarLoaded) return

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    d3.select('svg#radar').select('*').remove()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    radar_visualization({
      svg_id: 'radar',
      width: 1500,
      height: 1000,
      date: dateString,
      entries,
      ...config,
    })
  }, [isD3Loaded, isRadarLoaded, config, entries]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Script
        src="https://cdn.helpwave.de/js/d3.v4.min.js"
        onLoad={() => {
          setIsD3Loaded(true)
        }}
      />
      <Script
        src="https://cdn.helpwave.de/js/radar-0.8.js"
        onLoad={() => {
          setIsRadarLoaded(true)
        }}
      />
      <svg id="radar"></svg>
    </>
  )
}
