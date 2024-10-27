import type { PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { DomainEvent } from '@helpwave/proto-ts/services/updates_svc/v1/updates_svc_pb'
import { ReceiveUpdatesResponse } from '@helpwave/proto-ts/services/updates_svc/v1/updates_svc_pb'
import type { Observable } from 'rxjs'
import { filter, Subject } from 'rxjs'
import ReceiveUpdatesStreamHandler from './ReceiveUpdatesStreamHandler'

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
    const subscription = ReceiveUpdatesStreamHandler
      .getInstance()
      .start()
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
    return () => {
      subscription.unsubscribe()
      ReceiveUpdatesStreamHandler.getInstance().stop()
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
