import { useEffect, useRef } from 'react'

import { getTimezoneLabel, getTimezoneOffsetLabel } from 'lib/dates.js'
import { CheckIcon } from 'lib/icons/Check.js'

interface TimezoneListItemProps {
  value: string
  isSelected: boolean
  onClick: () => void
}

export function TimezoneListItem({
  value,
  onClick,
  isSelected,
}: TimezoneListItemProps): JSX.Element {
  const elRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (!isSelected) {
      return
    }

    const { current: item } = elRef

    if (item == null) {
      return
    }

    const container = item.closest('.seam-timezones')

    if (container == null) {
      return
    }

    const { height: containerHeight } = container.getBoundingClientRect()
    const { scrollTop: containerStart } = container
    const containerEnd = containerStart + containerHeight

    const { height: itemHeight } = item.getBoundingClientRect()
    const itemStart = item.offsetTop
    const itemEnd = itemStart + itemHeight

    const itemStartVisible =
      itemStart > containerStart && itemStart < containerEnd
    const itemEndVisible = itemEnd > containerStart && itemEnd < containerEnd

    const isVisible = itemStartVisible || itemEndVisible

    if (isVisible) {
      return
    }

    if (container != null) {
      container.scrollTop = item.offsetTop
    }
  }, [isSelected])

  return (
    <li className='seam-timezone' onClick={onClick} ref={elRef}>
      <span className='seam-utc-label'>{getTimezoneOffsetLabel(value)}</span>{' '}
      {getTimezoneLabel(value)}
      {isSelected && <CheckIcon className='check-icon' />}
    </li>
  )
}
