import { ArrowBackIcon } from 'lib/icons/ArrowBack.js'

export function ContentHeader(props: {
  title?: string
  onClickBack?: () => void
}) {
  return (
    <div className='seam--content-header'>
      <BackIcon onClick={props.onClickBack} />
      <span className='seam--title'>{props.title}</span>
    </div>
  )
}

function BackIcon(props: { onClick?: () => void }) {
  if (props.onClick === undefined) {
    return null
  }

  return <ArrowBackIcon className='seam--back-icon' onClick={props.onClick} />
}
