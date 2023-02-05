import * as React from 'react'
import type { TwindConfig } from '@twind/core'
import { setup, virtual as virtualSheet, stringify } from '@twind/core'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FakeContext = any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = object, S = object> = (new (...input: any[]) => T) & S

export default function withNextDocument<Doc, Base extends Constructor<Doc, Doc>, Config extends TwindConfig>(
  config: Config,
  BaseDocument: Base
): Base {
  let instance: ReturnType<typeof setup>
  try {
    instance = setup(config, virtualSheet(true))
  } catch (e) {
    console.warn(e)
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return class extends BaseDocument {
    static getInitialProps(ctx: FakeContext & { defaultGetInitialProps: { ctx: FakeContext, options?: { nonce?: string } } }) {
      const defaultGetInitialProps = ctx.defaultGetInitialProps.bind(ctx)

      ctx.defaultGetInitialProps = async (ctx: FakeContext, options: { nonce?: string } = {}) => {
        const props = await defaultGetInitialProps(ctx, options)

        const css = stringify(instance.target)

        const styleElement = React.createElement('style', {
          'data-twind': '',
          'id': '__twind',
          'key': 'twind',
          'nonce': options.nonce,
          'dangerouslySetInnerHTML': {
            __html: css
          }
        })

        return { ...props, styles: [...props.styles, styleElement] }
      }

      return super.getInitialProps(ctx)
    }
  }
}
