import type { EventsListParams, SeamHttpApiError } from '@seamapi/http/connect'
import type { SeamEvent } from '@seamapi/types/connect'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseEventsParams = EventsListParams

export type UseEventsData = SeamEvent[]

export interface UseEventsOptions {
  refetchInterval?: number
}

export function useEvents(
  params?: UseEventsParams,
  { refetchInterval }: UseEventsOptions = {}
): UseSeamQueryResult<'events', UseEventsData> {
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
      return events
    },
    refetchInterval,
  })

  return { ...rest, events: data }
}
