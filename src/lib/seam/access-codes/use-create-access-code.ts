import {
  useSeamMutation,
  type UseSeamMutationResult,
} from '@seamapi/react-query'
import { useQueryClient } from '@tanstack/react-query'

export function useCreateAccessCode(): UseSeamMutationResult<'/access_codes/create'> {
  const queryClient = useQueryClient()

  return useSeamMutation('/access_codes/create', {
    onSuccess: (data) => {
      queryClient.setQueryData(
        ['access_codes', 'get', { access_code_id: data.access_code_id }],
        data
      )
      void queryClient.invalidateQueries({ queryKey: ['access_codes', 'list'] })
    },
  })
}
