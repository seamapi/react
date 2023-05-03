import { ArrowBackIcon } from 'lib/icons/ArrowBack.js'

export function ContentHeader(props: {
  title?: string
  onClickBack?: () => void
}): JSX.Element {
  return (
    <div className='seam-content-header'>
      <BackIcon onClick={props.onClickBack} />
      <span className='seam-title'>{props.title}</span>
    </div>
  )
}

function BackIcon(props: { onClick?: () => void }): JSX.Element | null {
  if (props.onClick == null) {
    return null
  }

  return <ArrowBackIcon className='seam-back-icon' onClick={props.onClick} />
}
