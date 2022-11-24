import openapi from './swagger.json' assert { type: 'json' }
import { schemaToZodString } from './schema'
import type { Schema, PrimitiveSchema } from './schema'
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

const determineFunctionName = (route: Route['methods'][number]) => {
  return '<TODO FN NAME>'
  return route.summary // TODO: this is a hack that requires modifying the swagger.json file a bit for it to work
}

const generateFunctionDataFromRouteMethod = (path: string, route: Route['methods'][number], definitions: Record<string, Schema>) => {

  const args: { name: string, type: string }[] = route.parameters.map(parameter => {
    const name = parameter.name
    const schema = schemaToZodString(parameter.schema, definitions)
    return { name, type: `z.infer<typeof ${schema}>` }
  })

  const requestBody = route.parameters.find(parameter => parameter.in === 'body')
  const headers = route.parameters.filter(parameter => parameter.in === 'header')
  const query = route.parameters.filter(parameter => parameter.in === 'query')
  const textOrJson = route.produces.includes('application/json') ? 'json' : 'text'

  const happyResponse = route.responses['200'].schema
  // TODO: guessing indentation level of 4 here
  const zodSchema = happyResponse ? schemaToZodString(happyResponse, definitions, 4) : 'z.unknown()' // TODO: this shouldn't happen?

  return {
    fnName: determineFunctionName(route),
    method: route.method,
    path: path,
    args: args,
    requestBody: requestBody,
    headers: headers,
    query: query,
    mock: '<NOT IMPLEMENTED>', // TODO
    textOrJson: textOrJson,
    returnSchema: zodSchema
  }
}

const generateFunctionFromRouteMethod = (path: string, route: Route['methods'][number], definitions: Record<string, Schema>): string => {

  const data = generateFunctionDataFromRouteMethod(path, route, definitions)

  // TODO: optional parameters aren't really considered much

  const argsAsString = data.args.map(({ name, type }) => `${name}: ${type}`).join(', ')

  // TODO: add query string support
  const query = data.query.length > 0 ? `?TODO=THIS_IS_NOT_IMPLEMENTED_YET` : ''

  // only include body if not a get request
  const body = data.method === 'get'
    ? ''
    : data.requestBody
      ? `, ${data.requestBody.name}`
      : ', {}'

  const headers = data.headers.length > 0 ? `, { ${data.headers.map(header => `${header.name}: ${header.name}`).join(', ')} }` : ''

  const parts = [
    `const ${data.fnName} = (${argsAsString}) => {`,
    `  return api`,
    `    .${data.method}('${data.path}${query}'${body}${headers})`,
    `    .mock(${data.mock})`,
    `    .${data.textOrJson}(${data.returnSchema})`,
    `}`,
  ]

  return parts.join('\n')
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

// openapi allows parameters to "omit" the schema object and put the type directly in the parameter object (at least for primitive types like string, number, etc.)
type UnsensibleParameter = Omit<RouteParameter, 'schema'> & ({ schema: Schema } | PrimitiveSchema)

const sensibleParameter = (parameter: UnsensibleParameter): RouteParameter => {
  if('schema' in parameter) {
    return parameter
  } else {
    return {
      ...parameter,
      schema: { type: parameter.type }
    }
  }
}

type UnsensibleRoute = typeof openapi['paths'][keyof typeof openapi['paths']]

// turns the awkward openapi format into a more usable one
const sensibleRoute = (path: string, unsensibleRoute: UnsensibleRoute): Route => ({
  path,
  methods: Object.entries(unsensibleRoute).map(([method, value]) => ({
    method: method as 'get' | 'post' | 'put' | 'delete' | 'patch',
    description: value.description,
    summary: value.summary,
    produces: value.produces || [],
    tags: value.tags || [],
    parameters: value.parameters ? value.parameters.map(sensibleParameter) : [],
    responses: value.responses
  }))
})

const route = sensibleRoute('/users', openapi.paths['/users'])

// console.log(modelTypesAndSchemas)
// console.log(routeTypesAndSchemas)

console.log(generateFunctionFromRouteMethod('/users', route.methods[0], definitions))
