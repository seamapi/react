import type { EventsListParams, SeamHttpApiError } from '@seamapi/http/connect'
import type { SeamEvent } from '@seamapi/types/connect'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useSeamClient } from '@seamapi/react-query'
import type { UseSeamQueryResultLegacy } from 'lib/seam/use-seam-query-result.js'

export type UseEventsParams = EventsListParams

export type UseEventsData = SeamEvent[]

export interface UseEventsOptions {
  refetchInterval?: number
}

export function useEvents(
  params?: UseEventsParams,
  { refetchInterval }: UseEventsOptions = {}
): UseSeamQueryResultLegacy<'events', UseEventsData> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  const { data, ...rest } = useQuery<UseEventsData, SeamHttpApiError>({
    enabled: client != null,
    queryKey: ['events', 'list', params],
    queryFn: async () => {
      if (client == null) return []
      const events = await client.events.list(params)
      for (const event of events) {
        queryClient.setQueryData(
          ['events', 'get', { event_id: event.event_id }],
          event
        )
      }
      // UPSTREAM: Response type does not match SeamEvent[].
      return events as SeamEvent[]
    },
    refetchInterval,
  })

  return { ...rest, events: data }
}
