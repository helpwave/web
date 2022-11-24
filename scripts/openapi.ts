import openapi from './swagger.json' assert { type: 'json' }
import { schemaToZodString } from './schema'
import type { Schema } from './schema'
import { keyInfoToSchemaAndType, calculateKeyInfo } from './names'
import type { KeyInfo } from './names'

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

const modelTypes: KeyInfo[] = Object.keys(openapi.definitions)
  .filter(key => key.startsWith('models.'))
  .map(calculateKeyInfo('models', 'model', 'Model'))

const routeTypes: KeyInfo[] = Object.keys(openapi.definitions)
  .filter(key => key.startsWith('routes.'))
  .map(calculateKeyInfo('routes', 'route', 'Route'))

const definitions = openapi.definitions as Record<string, Schema>

// this generates the type and schema definitions for both routes and models
const modelTypesAndSchemas = modelTypes.map(fullKey => keyInfoToSchemaAndType(definitions, fullKey)).join('\n\n')
const routeTypesAndSchemas = routeTypes.map(fullKey => keyInfoToSchemaAndType(definitions, fullKey)).join('\n\n')

// turns the awkward openapi format into a more usable one
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

// console.log(modelTypesAndSchemas)
// console.log(routeTypesAndSchemas)

console.log(generateFunctionFromRouteMethod('/version', route.methods[0], definitions))
