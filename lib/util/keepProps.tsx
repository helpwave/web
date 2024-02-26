export type KeepProps<T, K extends keyof T> = {
  [P in K]: T[P];
}
