import { DateTime } from 'luxon'

import { EditIcon } from 'lib/icons/Edit.js'
import { IconButton } from 'lib/ui/IconButton.js'

interface AccessCodeFormTimesProps {
  startDate: DateTime
  endDate: DateTime
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
        <span className='seam-time'>{formatDateTime(startDate)}</span>
        <span className='seam-label'>{t.endTimeLabel}</span>
        <span className='seam-time'>{formatDateTime(endDate)}</span>
      </div>
      <IconButton onClick={onEdit} className='seam-show-date-picker-btn'>
        <EditIcon />
      </IconButton>
    </div>
  )
}

const formatDateTime = (dateTime: DateTime): string =>
  dateTime.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)

const t = {
  startTimeLabel: 'Start',
  endTimeLabel: 'End',
}
