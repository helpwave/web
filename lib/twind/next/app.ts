import { setup, getSheet } from '@twind/core'
import type { TwindConfig } from '@twind/core'

export default function withNextApp<Base>(config: TwindConfig, BaseApp: Base): Base {
  if (typeof window !== 'undefined') {
    const fakeObserverTarget = document.createElement('body')

    if (document.querySelector('style[data-twind]') === null) {
      const sheetTarget = document.createElement('style')
      sheetTarget.setAttribute('data-twind', '')
      sheetTarget.setAttribute('id', '__twind')
      document.head.appendChild(sheetTarget)
    }

    const sheet = getSheet(false, false)
    setup(config, sheet, fakeObserverTarget)
  }

  return BaseApp
}
