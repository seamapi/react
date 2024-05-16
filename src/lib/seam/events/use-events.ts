import { useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  Event,
  EventsListRequest,
  EventsListResponse,
  SeamError,
} from 'seamapi'

import { useSeamClient } from 'lib/seam/use-seam-client.js'
import type { UseSeamQueryResult } from 'lib/seam/use-seam-query-result.js'

export type UseEventsParams = EventsListRequest
export type UseEventsData = Event[]

export function useEvents(
  params?: UseEventsParams
): UseSeamQueryResult<'events', UseEventsData> {
  const { client } = useSeamClient()
  const queryClient = useQueryClient()

  const { data, ...rest } = useQuery<EventsListResponse['events'], SeamError>({
    enabled: client != null,
    queryKey: ['events', 'list', params],
    queryFn: async () => {
      if (client == null) return []
      return await client.events.list(params)
    },
    onSuccess: (events) => {
      console.log({ events })
      for (const event of events) {
        queryClient.setQueryData(
          ['events', 'get', { event_id: event.event_id }],
          event
        )
      }
    },
  })

  return { ...rest, events: data }
}
