import { formatDateTimeReadable } from 'lib/dates.js'
import { EditIcon } from 'lib/icons/Edit.js'
import { IconButton } from 'lib/ui/IconButton.js'

interface AccessCodeFormTimesProps {
  startDate: string
  endDate: string
  onEdit: () => void
}

export function AccessCodeFormTimes({
  startDate,
  endDate,
  onEdit,
}: AccessCodeFormTimesProps): JSX.Element {
  return (
    <div className='seam-selected-times'>
      <div>
        <span className='seam-label'>{t.startTimeLabel}</span>
        <span className='seam-time'>{formatDateTimeReadable(startDate)}</span>
        <span className='seam-label'>{t.endTimeLabel}</span>
        <span className='seam-time'>{formatDateTimeReadable(endDate)}</span>
      </div>
      <IconButton onClick={onEdit} className='seam-show-date-picker-btn'>
        <EditIcon />
      </IconButton>
    </div>
  )
}

const t = {
  startTimeLabel: 'Start',
  endTimeLabel: 'End',
}
