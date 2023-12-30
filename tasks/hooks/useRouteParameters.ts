import { useRouter } from 'next/router'

/**
 * THIS SHOULD ONLY BE USED IN PAGES!
 *
 * The reason for this is that with pages you can be sure by looking at the URL which parameters are present.
 * This is not the case for arbitrary components and thus using this hook invites a whole bunch of incorrect types
 * and usages.
 *
 * In general the router should only be used in pages if possible, an exception is pushing new routes to the router.
 *
 * The `PathParameters` generic is used to specify which parameters are present in the URL path (`/route/[id]/subroute`) by key.
 * The `QueryParameters` generic is used to specify which parameters are present in the URL querystring (`?id=123`) by key.
 */
export const useRouteParameters = <PathParameters extends string, QueryParameters extends string = never>() => {
  return useRouter().query as Record<PathParameters, string> & Record<QueryParameters, string | undefined>
}
