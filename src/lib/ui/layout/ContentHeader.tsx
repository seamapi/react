import { ArrowBackIcon } from 'lib/icons/ArrowBack.js'
import { useNavigation } from 'lib/NavigationProvider.js'

export function ContentHeader(props: { title?: string }): JSX.Element | null {
  const { title } = props

  const { goBack } = useNavigation()
  if (!title && !goBack) {
    return null
  }

  return (
    <div className='seam-content-header'>
      {goBack && <BackIcon onClick={goBack} />}
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
