const fs = require('fs')
const path = require('path')

if (process.argv.length < 1) {
  console.error('use --help to get all commands')
  process.exit(1)
}

const args = process.argv.slice(2)
const helpText =
`usage: generate [options] [relative filepath]
Options and arguments:
--help         :  prints all options
--no-props     :  sets the component props to Record<string, never>
 -nop          :  sets the component props to Record<string, never>
--no-translate :  generates the component without a translation
 -notl         :  generates the component without a translation`
if (args.find(value => value === '--help')) {
  console.log(helpText)
  process.exit(0)
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function removeNonAlphanumeric(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '')
}

let filePathInput = args.find(value => !value.startsWith('-'))
if (!filePathInput) {
  console.error('the file can\'t start with the character - and must be given\nuse --help to get all commands')
  process.exit(1)
}
filePathInput = filePathInput + (filePathInput.endsWith('.tsx') || filePathInput.endsWith('.ts') ? '' : '.tsx')
const filePath = path.resolve(process.cwd(), filePathInput)
const componentName = capitalize(removeNonAlphanumeric(path.parse(filePathInput).name))

const isUsingTranslation = args.indexOf('--no-translate') === -1 && args.indexOf('-notl') === -1
const isUsingProps = args.indexOf('--no-props') === -1 && args.indexOf('-nop') === -1

const standardImports = `import { tw } from '@helpwave/common/twind'`
const translationImports =
`import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'`
const imports = standardImports + (isUsingTranslation ? `\n` + translationImports : '')

const translation = isUsingTranslation ?
`type ${componentName}Translation = {
}

const default${componentName}Translation: Record<Languages, ${componentName}Translation > = {
  en: {
  },
  de: {
  }
}` : ''

const props = isUsingProps ?
`export type ${componentName}Props = {
}` :
`export type ${componentName}Props = Record<string, never>`

const propsType = isUsingTranslation ?
`{
  language,
}: PropsWithLanguage<${componentName}Translation, ${componentName}Props>` :
`{
} : ${componentName}Props`

const body =
`/**
 * Description
 */
export const ${componentName} = (${propsType}) => {${isUsingTranslation ? `\n  const translation = useTranslation(language, default${componentName}Translation)` : ''}
  return (
    <div>
        // Your Code
    </div>
  )
}`

const file = [imports, translation, props, body].filter(value => !!value).join('\n\n') + `\n`

if (fs.existsSync(filePath)) {
  console.error(`File "${path.basename(filePath)}" already exists.`)
} else {
  fs.writeFile(filePath, file, (err) => {
    if (err) {
      console.error('Error writing to file:', err)
    } else {
      console.log('File created successfully.')
    }
  })
}
