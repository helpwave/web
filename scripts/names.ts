import type { Schema } from './schema'
import { schemaToZodString } from "./schema"

export type KeyInfo = {
  prefix: string,
  key: string,
  fullKey: string,
  schemaName: string,
  typeName: string
}

export const keyInfoToSchemaAndType = (definitions: Record<string, Schema>, keyInfo: KeyInfo) => {
  const schema = definitions[`${keyInfo.prefix}.${keyInfo.key}`]
  const zodSchema = schemaToZodString(schema, definitions)

  const schemaDefinition = `export const ${keyInfo.schemaName} = ${zodSchema}`
  const typeDefinition = `export type ${keyInfo.typeName} = z.infer<typeof ${keyInfo.schemaName}>`

  return `${schemaDefinition}\n${typeDefinition}`
}

export const calculateKeyInfo = (splitPrefix: string, schemaPrefix: string, typePrefix: string) => (fullKey: string) => {
  const partialKey = fullKey.split('.')[1]
  return {
    prefix: splitPrefix,
    key: partialKey,
    fullKey: fullKey,
    schemaName: `${schemaPrefix}${partialKey}`, // TODO: lower camelcase
    typeName: `${typePrefix}${partialKey}` // TODO: upper camelcase
  }
}
