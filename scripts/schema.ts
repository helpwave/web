import { z } from 'zod'

export type SchemaObject = {
  type: 'object'
  required: string[],
  properties: {
    [key: string]: Schema
  }
}

export type PrimitiveSchema =
| { type: 'string', example?: string }
| { type: 'number' | 'integer', example?: number }
| { type: 'boolean', example?: boolean }

export type Schema = SchemaObject | PrimitiveSchema | { type: 'array', items: Schema } | { '$ref': string }


const resolveRef = (ref: string, allSchemas: Record<string, Schema>): Schema => {
  // TODO: this'll probably not parse all refs
  return allSchemas[ref.replace('#/definitions/', '')]
}

export const schemaToExample = (schema: Schema, allSchemas: Record<string, Schema>): any => {
  if('$ref' in schema) {
    return schemaToExample(resolveRef(schema['$ref'], allSchemas), allSchemas)
  } else {
    switch(schema.type) {
      case 'object':
        return Object.fromEntries(
          Object.entries(schema.properties).map(([key, value]) => {
            return [key, schemaToExample(value, allSchemas)]
          })
        )
      case 'array': return schemaToExample(schema.items, allSchemas)
      case 'string': return schema.example || 'TODO'
      case 'number': return schema.example || 'TODO'
      case 'integer': return schema.example || 'TODO'
      case 'boolean': return schema.example || 'TODO'
      default:
          throw new Error('not implemented: ' + (schema as { type: string }).type)
    }
  }
}

const schemaToZod = (schema: Schema, allSchemas: Record<string, Schema>): z.Schema => {
  if('$ref' in schema) {
    return schemaToZod(resolveRef(schema['$ref'], allSchemas), allSchemas)
  } else {
    switch(schema.type) {
      case 'object':
        return z.object(
          Object.fromEntries(
            Object.entries(schema.properties).map(([key, value]) => {
              if ((schema.required || []).includes(key)) {
                return [key, schemaToZod(value, allSchemas)]
              } else {
                return [key, schemaToZod(value, allSchemas).optional()]
              }
            })
          )
        )
      case 'array': return z.array(schemaToZod(schema.items, allSchemas))
      case 'string': return z.string()
      case 'number': return z.number()
      case 'integer': return z.number().int()
      case 'boolean': return z.boolean()
      default:
          throw new Error('not implemented: ' + (schema as { type: string }).type)
    }
  }
}

const objectify = (obj: Record<string, string>, indentation: number): string => {
  const entries = Object.entries(obj).map(([key, value]) => `${' '.repeat(indentation + 2)}${key}: ${value}`).join(',\n')
  return `{\n${entries}\n${' '.repeat(indentation)}}`
}

export const schemaToZodString = (schema: Schema, allSchemas: Record<string, Schema>, indentation=0): string => {
  if('$ref' in schema) { // TODO: maybe this should not resolve dependencies but rather access already generated schema strings
    return schemaToZodString(resolveRef(schema['$ref'], allSchemas), allSchemas, indentation)
  } else {
    switch(schema.type) {
      case 'object':
        const constructedObject = Object.fromEntries(
          Object.entries(schema.properties).map(([key, value]) => {
            if ((schema.required || []).includes(key)) {
              return [key, schemaToZodString(value, allSchemas, indentation + 2)]
            } else {
              return [key, `${schemaToZodString(value, allSchemas, indentation + 2)}.optional()`]
            }
          })
        )
        return `z.object(${objectify(constructedObject, indentation)})`
      case 'array': return `z.array(${schemaToZodString(schema.items, allSchemas)})`
      case 'string': return `z.string()`
      case 'number': return `z.number()`
      case 'integer': return `z.number().int()`
      case 'boolean': return `z.boolean()`
      default:
          throw new Error('not implemented: ' + (schema as { type: string }).type)
    }
  }
}
