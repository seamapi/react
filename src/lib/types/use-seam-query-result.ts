import type { UseQueryResult } from '@tanstack/react-query'
import type { SeamError } from 'seamapi'

export type UseSeamQueryResult<Field extends string, Data> = Omit<
  UseQueryResult<Data, SeamError>,
  'data'
> & { [key in Field]: Data }
