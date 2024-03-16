# Translation
Translations are handled with three steps and per component.

1. The type for the translation
2. The default values for the translation
3. The `useTranslation` hook

Example:
```tsx
import { useTranslation } from '../../hooks/useTranslation'
import type { PropsForTranslation } from '../../hooks/useTranslation'
import type { Languages } from '../../hooks/useLanguage'

type TitleTranslation = {
  welcome: string,
  goodToSeeYou: string,
  page: (page: number) => string
}

const defaultTitleTranslations: Record<Languages, TitleTranslation> = {
  en: {
    welcome: 'Welcome',
    goodToSeeYou: 'Good to see you',
    page: (page) => `Page ${page}`
  },
  de: {
    welcome: 'Willkommen',
    goodToSeeYou: 'Schön dich zu sehen',
    page: (page) => `Seite ${page}`
  }
}

const Title = ({ overwriteTranslation, name }:PropsForTranslation<TitleTranslation, TitleProps>) => {
  const translation = useTranslation(defaultTitleTranslations, overwriteTranslation)
  return (
    <p className={tw('rounded bg-gray-800 text-gray-200 p-1 px-2')}>
      {translation.welcome}{'! '}
      {translation.goodToSeeYou}{', '}
      <span className={tw('text-green-300')}>{name}</span>{'. '}
      {translation.page(123)}
    </p>
  )
}
```

## Automatic Generation
These components can be automatically generated with the following commands:

```
node generate_boilerplate <relative filepath>
```
or
```
pnpm run generate <relative filepath>
```
