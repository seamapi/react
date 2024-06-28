import type { SeamHttpApiError } from '@seamapi/http/connect'
import type { UseQueryResult } from '@tanstack/react-query'

export type UseSeamQueryResult<Field extends string, ResponsePayload> = Omit<
  UseQueryResult<ResponsePayload, SeamHttpApiError>,
  'data'
> & { [key in Field]?: ResponsePayload }
