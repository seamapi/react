import type { ComponentType } from 'react'

import { useComponentTelemetry } from 'lib/telemetry/hooks.js'

export function withTelemetry<P extends JSX.IntrinsicAttributes>(
  Component: ComponentType<P>
): (props: P) => JSX.Element | null {
  const name = Component.displayName ?? Component.name ?? 'Component'

  function WithTelemetry(props: P): JSX.Element | null {
    useComponentTelemetry(name)
    return <Component {...props} />
  }

  WithTelemetry.displayName = `WithTelemetry(${name})`

  return WithTelemetry
}
