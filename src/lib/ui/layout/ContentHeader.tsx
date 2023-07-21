import { ArrowBackIcon } from 'lib/icons/ArrowBack.js'

interface ContentHeaderProps {
  onBack?: () => void
  title?: string
  subheading?: string
}

export function ContentHeader(props: ContentHeaderProps): JSX.Element | null {
  const { title, onBack, subheading } = props
  if (title == null && onBack == null) {
    return null
  }

  return (
    <div className='seam-content-header'>
      <BackIcon onClick={onBack} />
      <div>
        <span className='seam-title'>{title}</span>
        {subheading != null && (
          <span className='seam-subheading'>{subheading}</span>
        )}
      </div>
    </div>
  )
}

function BackIcon(props: { onClick?: () => void }): JSX.Element | null {
  if (props.onClick == null) {
    return null
  }

  return <ArrowBackIcon className='seam-back-icon' onClick={props.onClick} />
}
