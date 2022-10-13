import type { z } from 'zod'
import config from './config'

const addContentType = (headers?: Headers) => {
  if (!headers) {
    headers = new Headers()
  }
  headers.set('Content-Type', 'application/json')
  return headers
}

// TODO: add a way to log requests to the console (using console.groupCollapsed() console.groupEnd())
const create = (path: string, options: RequestInit) => ({
  mock: <T>(mockedData: T) => ({
    json: <S extends z.ZodType<T>>(schema: S): Promise<z.output<S>> => {
      const jsonPromise = config.mock ? Promise.resolve(mockedData) : fetch(config.apiUrl + path, options).then(res => res.json())
      return jsonPromise.then(schema.parse)
    },

    text: <S extends z.ZodType<string>>(schema: S): Promise<z.output<S>> => {
      if (typeof mockedData !== 'string') throw new Error('Type mismatch: mocked data should be of type string when used in conjunctinon with ".text"')

      const stringPromise = config.mock ? Promise.resolve(mockedData) : fetch(config.apiUrl + path, options).then(res => res.text())
      return stringPromise.then(schema.parse)
    }
  })
})

const api = {
  get: (path: string, headers?: Headers) =>
    create(path, { method: 'GET', headers, body: null }),

  post: <BodyType>(path: string, body: BodyType, headers?: Headers) =>
    create(path, { method: 'POST', headers: addContentType(headers), body: JSON.stringify(body) }),

  put: <BodyType>(path: string, body: BodyType, headers?: Headers) =>
    create(path, { method: 'PUT', headers: addContentType(headers), body: JSON.stringify(body) }),

  patch: <BodyType>(path: string, body: BodyType, headers?: Headers) =>
    create(path, { method: 'PATCH', headers: addContentType(headers), body: JSON.stringify(body) }),

  delete: <BodyType>(path: string, body: BodyType, headers?: Headers) =>
    create(path, { method: 'DELETE', headers: addContentType(headers), body: JSON.stringify(body) }),
}

export default api
