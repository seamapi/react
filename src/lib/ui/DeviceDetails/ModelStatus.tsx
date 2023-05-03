import type { LockDevice } from 'seamapi'

export function ModelStatus(props: { device: LockDevice }): JSX.Element | null {
  const {
    device: { properties },
  } = props

  const model =
    properties?.august_metadata?.model ?? properties?.schlage_metadata?.model

  if (model == null) {
    return null
  }

  return (
    <>
      <span className='seam-label'>{t.model}:</span>{' '}
      <div className='seam-device-model'>{model}</div>
    </>
  )
}

const t = {
  model: 'Model',
}
