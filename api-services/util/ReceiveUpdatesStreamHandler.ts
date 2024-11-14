import type { ClientReadableStream } from 'grpc-web'
import type { ReceiveUpdatesResponse } from '@helpwave/proto-ts/services/updates_svc/v1/updates_svc_pb'
import { ReceiveUpdatesRequest } from '@helpwave/proto-ts/services/updates_svc/v1/updates_svc_pb'
import { Subject } from 'rxjs'
import { APIServices } from '../services'
import { getAuthenticatedGrpcMetadata } from '../authentication/grpc_metadata'

export const connectReceiveUpdatesStream = (revision?: number): ClientReadableStream<ReceiveUpdatesResponse> => {
  const req = new ReceiveUpdatesRequest()
  if (revision !== undefined) req.setRevision(revision)
  return APIServices.updates.receiveUpdates(req, getAuthenticatedGrpcMetadata())
}

const subject = new Subject<ReceiveUpdatesResponse>()

/**
 * ReceiveUpdatesStreamHandler handles reconnections to the ReceiveUpdates server-side stream.
 * The stream gets closed by the server when the ID token gets expired.
 */
export default class ReceiveUpdatesStreamHandler {
  private static instance?: ReceiveUpdatesStreamHandler
  public readonly observable = subject.asObservable()
  private static reconnectionTimeoutInMs: number = 1000
  private stream?: ClientReadableStream<ReceiveUpdatesResponse>
  private revision?: number

  public static getInstance() {
    if (!ReceiveUpdatesStreamHandler.instance) {
      ReceiveUpdatesStreamHandler.instance = new ReceiveUpdatesStreamHandler()
    }
    return ReceiveUpdatesStreamHandler.instance
  }

  public start(): ReceiveUpdatesStreamHandler {
    if (this.stream) return this
    this.connect()
    return this
  }

  public stop(): ReceiveUpdatesStreamHandler {
    if (!this.stream) return this
    this.disconnect()
    return this
  }

  private connect() {
    const stream = connectReceiveUpdatesStream(this.revision)
    this.stream = stream

    stream.on('error', (err) => {
      console.error('ReceiveUpdatesStreamHandler.connect.error', err)
      this.reconnect()
    })
    stream.on('end', () => this.reconnect())
    stream.on('data', (res) => {
      this.revision = res.getRevision()
      subject.next(res)
    })
  }

  private disconnect() {
    this.stream?.cancel()
    this.stream = undefined
  }

  private reconnect() {
    this.disconnect()
    setTimeout(() => {
      this.connect()
    }, ReceiveUpdatesStreamHandler.reconnectionTimeoutInMs)
  }
}
