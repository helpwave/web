export type NativeProps<
  NativeElement extends keyof React.ReactHTML,
  OmittedKeys extends string | number | symbol | undefined = undefined
> = Omit<React.JSX.IntrinsicElements[NativeElement], OmittedKeys extends undefined ? 'ref' : 'ref' | OmittedKeys>
