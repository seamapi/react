import { type SeamError, SeamMalformedInputError } from 'seamapi'

export const getValidationError = (params: {
  error: SeamError
  property: string
}): string | undefined => {
  const { error, property } = params
  if (!(error instanceof SeamMalformedInputError)) {
    return undefined
  }

  const propertyErrors = (error.validationErrors[property] ?? {
    _errors: [],
  }) as {
    _errors: string[]
  }

  return propertyErrors._errors[0]
}
