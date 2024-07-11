import { SeamMalformedInputError } from '@seamapi/http/connect'

export const getValidationError = (params: {
  error: Error
  property: string
}): string | undefined => {
  const { error, property } = params
  if (!(error instanceof SeamMalformedInputError)) {
    return undefined
  }

  const propertyErrors = error.validationErrors[property] ?? {
    _errors: [],
  }

  return propertyErrors._errors[0]
}
