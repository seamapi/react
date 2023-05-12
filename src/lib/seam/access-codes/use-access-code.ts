import { useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import type { AccessCode, AccessCodeGetRequest } from 'seamapi'
import { v4 as uuid } from 'uuid'

import { useSeamClient } from 'lib/seam/use-seam-client.js'

export type UseAccessCodeParams = AccessCodeGetRequest | string
export type UseAccessCodeData = AccessCode

export function useAccessCode(params: UseAccessCodeParams) {
  const { client } = useSeamClient()

  const normalizedParams =
    typeof params === 'string' ? { access_code_id: params } : params

  return useQuery({
    enabled: client != null,
    queryKey: ['access_code', 'get', normalizedParams],
    queryFn: async () => {
      if (client == null) return null

      return await client?.accessCodes.get(normalizedParams)
    },
  })
}

export function useFakeAccessCode(_params: UseAccessCodeParams): {
  isLoading: boolean
  data: AccessCode
} {
  const accessCode: AccessCode = {
    access_code_id: uuid(),
    type: 'time_bound',
    starts_at: DateTime.now().minus({ days: 2 }).toISO() ?? '',
    ends_at: DateTime.now().plus({ days: 1 }).toISO() ?? '',
    code: '1234',
    created_at: DateTime.now().toISO() ?? '',
    device_id: 'some_device_id',
    status: 'set',
    name: 'Guest - Kranz',
  }

  return { isLoading: false, data: accessCode }
}
