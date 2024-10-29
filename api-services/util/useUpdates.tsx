import type { PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { Observable } from 'rxjs'
import { filter, fromEvent, map, startWith, Subject } from 'rxjs'
import type { DomainEvent } from '@helpwave/proto-ts/services/updates_svc/v1/updates_svc_pb'
import { ReceiveUpdatesResponse } from '@helpwave/proto-ts/services/updates_svc/v1/updates_svc_pb'
import ReceiveUpdatesStreamHandler from './ReceiveUpdatesStreamHandler'

// Two types of speed should be enough.
// There is currently no reason for a frontend developer
// to differentiate between for example 2g or 3g.
let networkSpeed$: Observable<'slow' | 'fast'> | undefined

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connection = (navigator as any).connection

  if (connection && connection?.effectiveType) {
    networkSpeed$ = fromEvent(connection, 'change')
      .pipe(
        startWith(connection!.effectiveType!),
        map((event) => {
          const effectiveType = typeof event === 'string' ? event : connection!.effectiveType!
          return ['3g', '4g'].includes(effectiveType) ? 'fast' : 'slow'
        })
      )
  }
}

type UpdatesSubject = {
  aggregateType: string,
  aggregateId: string
}

const updatesSubject = new Subject<UpdatesSubject>()

export type UpdatesContextValue = {
  revision?: number,
  connected: boolean,
  observable: Observable<UpdatesSubject>,
  observeAttribute: <K extends keyof UpdatesSubject>(attribute: K, value: UpdatesSubject[K]) => Observable<UpdatesSubject>
}

export const UpdatesContext = createContext<UpdatesContextValue>({
  connected: false,
  observable: updatesSubject.asObservable(),
  observeAttribute: () => updatesSubject
})

export const useUpdates = () => useContext(UpdatesContext)

export const ProvideUpdates = ({ children }: PropsWithChildren) => {
  const streamRef = useRef<ReceiveUpdatesStreamHandler | null>(null)
  const [revision, setRevision] = useState<number>()

  useEffect(() => {
    const receiveUpdatesStreamHandlerSubscription = ReceiveUpdatesStreamHandler
      .getInstance()
      .observable
      .subscribe((res) => {
        let domainEvent: DomainEvent

        switch (res.getEventCase()) {
          case ReceiveUpdatesResponse.EventCase.DOMAIN_EVENT:
            domainEvent = res.getDomainEvent()!
            updatesSubject.next({
              aggregateType: domainEvent.getAggregateType(),
              aggregateId: domainEvent.getAggregateId()
            })
            break
        }

        // Only set revision when handlers are executed successfully
        setRevision(res.getRevision())
      })

    const networkSpeedSubscription = networkSpeed$
      ?.subscribe((speed) => {
        switch (speed) {
          case 'slow':
            ReceiveUpdatesStreamHandler.getInstance().stop()
            break
          case 'fast':
            ReceiveUpdatesStreamHandler.getInstance().start()
            break
        }
      })

    return () => {
      networkSpeedSubscription?.unsubscribe()
      receiveUpdatesStreamHandlerSubscription.unsubscribe()
    }
  }, [])

  return (
    <UpdatesContext.Provider value={{
      revision,
      connected: !!streamRef.current,
      observable: updatesSubject.asObservable(),
      observeAttribute: (attribute, value) => {
        return updatesSubject.pipe(
          filter(event => event[attribute] === value)
        )
      }
    }}>
      {children}
    </UpdatesContext.Provider>
  )
}
