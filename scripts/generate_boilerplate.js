const fs = require('fs')
const path = require('path')
const {program} = require('commander')

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function removeNonAlphanumeric(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '')
}

// Program definition
program
  .name('boilerplate_generator')
  .description('CLI to automatically create helpwave components')
  .version('0.1.0')
  .option('-nop, --no-props', 'Sets the component props to Record<string, never>', true)
  .option('-notl, --no-translate', 'Generates the component without a translation', true)
  .option('-h, --help', 'Display help for command', false)
  .option('-f, --force', "Overwrite the file if it exists", false)
  .option('-d, --debug', "Create debug output", false)
  .option('--fileType <type>', "The file type. Defaults to tsx", "tsx")
  .argument('[Name]', "The path or name of the component")
  .action((path, options) => {
    if (!path || options.help) {
      program.help();
      process.exit(1);
    }
  })
  .parse()

const options = program.opts();
const args = program.args;

if(options.debug){
  console.log('options', options)
  console.log('args', args)
  console.log('execute location', process.env.INIT_CWD)
}


const filePathInput = args[0] + (args[0].endsWith('.tsx') || args[0].endsWith('.ts') ? '' : '.tsx');
let cwd = process.env.INIT_CWD ?? process.cwd()
let filePath = path.resolve(cwd, filePathInput);
const dir = path.dirname(filePath)
const componentName = capitalize(removeNonAlphanumeric(path.parse(filePathInput).name))
const fileName = `${componentName}.${options.fileType}`
filePath = path.resolve(dir, fileName)

const imports = {
  standard: `import { tw } from '@helpwave/common/twind'`,
  translation: `import type { Languages } from '@helpwave/common/hooks/useLanguage'\n` +
    `import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'`
}
const usedImports = imports["standard"] + (options.translate ? `\n${imports["translation"]}` : '')

const translation = options.translate ?
  `type ${componentName}Translation = {\n}\n\nconst default${componentName}Translation: Record<Languages, ${componentName}Translation > = {\n`
  + `  en: {\n  },\n  de: {\n  }\n}`
  : ''

const props = `export type ${componentName}Props = ${options.props ? `{\n}` : `Record<string, never>`}`

const propsType = options.translate ?
  `{\n  overwriteTranslation,\n}: PropsForTranslation<${componentName}Translation, ${componentName}Props>`
  : `{\n} : ${componentName}Props`

const body =
  `/**\n * Description\n */\n` +
  `export const ${componentName} = (${propsType}) => {\n` +
  `${options.translate ? `  const translation = useTranslation(default${componentName}Translation, overwriteTranslation)\n` : ''}` +
  `  return (\n    <div>\n      { /* Your Code */ }\n    </div>\n  )\n}`

const file = [usedImports, translation, props, body].filter(value => !!value).join('\n\n') + `\n`

if (fs.existsSync(filePath) && !options.force) {
  console.error(`File "${path.basename(filePath)}" already exists. To overwrite it use -f.`)
} else {
  if(!fs.existsSync(dir)){
    fs.mkdir(dir, {}, (err) => {
      if (err) {
        console.error('Error creating directory:', err)
        process.exit(1)
      } else {
        console.log(`Directory ${dir} created successfully.`)
      }
    })
  }
  fs.writeFile(filePath, file, (err) => {
    if (err) {
      console.error('Error writing to file:', err)
    } else {
      console.log(`File ${fileName} created successfully.`)
    }
  })
}
