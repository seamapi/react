import { ArrowBackIcon } from 'lib/icons/ArrowBack.js'

export function ContentHeader(props: {
  title?: string
  onBack?: () => void
}): JSX.Element | null {
  const { title, onBack } = props
  if (!title && !onBack) {
    return null
  }

  return (
    <div className='seam-content-header'>
      <BackIcon onClick={onBack} />
      <span className='seam-title'>{title}</span>
    </div>
  )
}

function BackIcon(props: { onClick?: () => void }): JSX.Element | null {
  if (props.onClick == null) {
    return null
  }

  return <ArrowBackIcon className='seam-back-icon' onClick={props.onClick} />
}
