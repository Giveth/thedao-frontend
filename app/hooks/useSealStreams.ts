import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { formatEther } from 'viem'
import {
  ETHX_TOKEN,
  OPERATIONAL_MULTISIG,
  SEAL_ONCHAIN,
  SUPERFLUID_SUBGRAPH_URL,
  type StreamState,
} from '~/routes/transparency.($project)/data'

interface SubgraphStream {
  receiver: { id: string }
  currentFlowRate: string
  streamedUntilUpdatedAt: string
  updatedAtTimestamp: string
}

/** Stream state keyed by lowercase receiver address. */
export type StreamMap = Record<string, StreamState>

/** Verified on-chain values, so the UI keeps ticking if the subgraph is down. */
const FALLBACK_STREAMS: StreamMap = Object.fromEntries(
  Object.values(SEAL_ONCHAIN).map((o) => [o.receiver, o.streamFallback]),
)

async function fetchSealStreams(): Promise<StreamMap> {
  const response = await fetch(SUPERFLUID_SUBGRAPH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `{
        streams(where: { sender: "${OPERATIONAL_MULTISIG}", token: "${ETHX_TOKEN}" }) {
          receiver { id }
          currentFlowRate
          streamedUntilUpdatedAt
          updatedAtTimestamp
        }
      }`,
    }),
  })
  if (!response.ok) {
    throw new Error('Failed to fetch Superfluid streams')
  }
  const { data } = (await response.json()) as { data?: { streams?: SubgraphStream[] } }
  if (!data?.streams) {
    throw new Error('Unexpected Superfluid subgraph response')
  }

  const map: StreamMap = {}
  for (const stream of data.streams) {
    map[stream.receiver.id.toLowerCase()] = {
      flowRate: BigInt(stream.currentFlowRate),
      streamedUntilUpdatedAt: BigInt(stream.streamedUntilUpdatedAt),
      updatedAtTimestamp: Number(stream.updatedAtTimestamp),
    }
  }
  return map
}

/**
 * Live Superfluid stream state for the SEAL & SEAL 911 grants. Always returns
 * usable data: verified static values are used until the subgraph responds
 * (and whenever it fails).
 */
export function useSealStreams(): { streams: StreamMap; isLive: boolean } {
  const { data } = useQuery({
    queryKey: ['sealStreams'],
    queryFn: fetchSealStreams,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    retry: 1,
  })

  return { streams: data ?? FALLBACK_STREAMS, isLive: data !== undefined }
}

/** ETH streamed so far, computed in bigint to keep wei precision. */
export function streamedSoFar(stream: StreamState, nowMs: number): number {
  const elapsedSeconds = BigInt(Math.max(0, Math.floor(nowMs / 1000) - stream.updatedAtTimestamp))
  const wei = stream.streamedUntilUpdatedAt + stream.flowRate * elapsedSeconds
  return Number(formatEther(wei))
}

/** ETH streamed so far to a project, or 0 for projects without a stream. */
export function projectStreamedEth(name: string, streams: StreamMap, nowMs: number): number {
  const receiver = SEAL_ONCHAIN[name]?.receiver
  const stream = receiver ? streams[receiver] : undefined
  return stream ? streamedSoFar(stream, nowMs) : 0
}

/**
 * Current time, ticking every `intervalMs`. Starts as `null` and only begins
 * ticking after mount so prerendered HTML and the first client render match.
 */
export function useNow(intervalMs = 1000): number | null {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}
