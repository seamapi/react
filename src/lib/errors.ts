import { isSeamHttpApiError } from '@seamapi/http/connect'

export function getErrorMessage(error?: Error | null | undefined): string {
  if (isSeamHttpApiError(error)) {
    return error.message
  }

  return t.anUnknownErrorOccurred
}

const t = {
  anUnknownErrorOccurred: 'An unknown error occurred',
}
