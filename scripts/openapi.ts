import openapi from './swagger.json' assert { type: 'json' }
import { z } from 'zod'

type SchemaObject = {
  type: 'object'
  required: string[],
  properties: {
    [key: string]: Schema
  }
}

type Schema = SchemaObject | { type: 'string' } | { type: 'number' | 'integer' } | { type: 'boolean' } | { type: 'array', items: Schema } | { '$ref': string }

type RouteParameter = {
  in: 'path' | 'query' | 'header' | 'body' | 'cookie',
  name: string,
  schema: Schema,
  required?: boolean,
  description?: string
}

type Route = {
  path: string,
  methods: {
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    description: string,
    summary: string,
    produces: string[], // TODO: look into this
    tags: string[], // TODO: look into this
    parameters: RouteParameter[] // TODO: look into this
    responses: {
      [code: string]: {
        description: string,
        schema?: Schema
      }
    }
  }[]
}

const resolveRef = (ref: string, allSchemas: Record<string, Schema>): Schema => {
  // TODO: this'll probably not parse all refs
  return allSchemas[ref.replace('#/definitions/', '')]
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

const schemaToZodString = (schema: Schema, allSchemas: Record<string, Schema>, indentation=0): string => {
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

const generateFunctionFromRouteMethod = (path: string, route: Route['methods'][number], definitions: Record<string, Schema>): string => {
  const fnName = route.summary
  const method = route.method
  const args: { name: string, type: string }[] = route.parameters.map(parameter => {
    const name = parameter.name
    const schema = schemaToZodString(parameter.schema, definitions) // TODO: this should rather use a global lookup table
    return { name, type: `z.infer<typeof ${schema}>` }
  })
  const argsAsString = args.map(({ name, type }) => `${name}: ${type}`).join(', ')
  const possibleRequestBody = '' // TODO: how is this even determined?
  const mock = '<NOT IMPLEMENTED>' // TODO
  const happyResponse = route.responses['200'].schema
  const zodSchema = happyResponse ? schemaToZodString(happyResponse, definitions) : 'z.unknown()' // TODO: this shouldn't happen?
  const textOrJson = route.produces.includes('application/json') ? 'json' : 'text'

  return `const ${fnName} = (${argsAsString}) => {\n  return api\n    .${method}('${path}'${possibleRequestBody})\n    .mock(${mock})\n    .${textOrJson}(${zodSchema})\n}`
}

const definitions = openapi.definitions as Record<string, Schema>

const modelTypes = Object.keys(openapi.definitions).filter(key => key.startsWith('models.')).map(key => key.split('.')[1]) // TODO: do uppercase / lowercase / prefixing n shit here instead
const routeTypes =  Object.keys(openapi.definitions).filter(key => key.startsWith('routes.')).map(key => key.split('.')[1])

console.log(modelTypes.map(key => {
  const schema = definitions[`models.${key}`]
  const zodSchema = schemaToZodString(schema, definitions)

  const schemaDefinition = `export const model${key.toLowerCase()} = ${zodSchema}`
  const typeDefinition = `export type Model${key} = z.infer<typeof model${key.toLowerCase()}>`

  return `${schemaDefinition}\n${typeDefinition}`
}).join('\n\n'))

console.log(routeTypes.map(key => {
  const schema = definitions[`routes.${key}`]
  const zodSchema = schemaToZodString(schema, definitions)

  const schemaDefinition = `export const route${key.toLowerCase()} = ${zodSchema}`
  const typeDefinition = `export type Route${key} = z.infer<typeof route${key.toLowerCase()}>`

  return `${schemaDefinition}\n${typeDefinition}`
}).join('\n\n'))

// Object.entries(definitions).forEach(([key, definition]) => {
//   const schema = schemaToZodString(definition, definitions)
//   console.log('\n--- ' + key + ' ---')
//   console.log(schema)
//   console.log('')
// })

const sensibleRoute = (path: string, unsensibleRoute: typeof openapi['paths'][keyof typeof openapi['paths']]): Route => ({
  path,
  methods: Object.entries(unsensibleRoute).map(([method, value]) => ({
    method: method as 'get' | 'post' | 'put' | 'delete' | 'patch',
    description: value.description,
    summary: value.summary,
    produces: value.produces || [],
    tags: value.tags || [],
    parameters: value.parameters || [],
    responses: value.responses
  }))
})

const route = sensibleRoute('/version', openapi.paths['/version'])

// console.log(generateFunctionFromRouteMethod('/version', route.methods[0], definitions))
