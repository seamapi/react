import type { UseQueryResult } from '@tanstack/react-query'
import type { SeamError } from 'seamapi'

export type UseSeamQueryResult<Field extends string, ResponsePayload> = Omit<
  UseQueryResult<ResponsePayload, SeamError>,
  'data'
> & { [key in Field]?: ResponsePayload }
