import { useEffect, useRef } from 'react'

import { getTimezoneLabel, getTimezoneOffset } from 'lib/dates.js'
import { CheckIcon } from 'lib/icons/Check.js'

interface TimezoneListItemProps {
  value: string
  isSelected: boolean
  onClick: () => void
  container: HTMLDivElement | null
}

export function TimezoneListItem({
  value,
  onClick,
  isSelected,
  container,
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
  }, [isSelected, container])

  return (
    <li className='seam-timezone' onClick={onClick} ref={elRef}>
      <span className='seam-utc-label'>UTC {getTimezoneOffset(value)}</span>{' '}
      {getTimezoneLabel(value)}
      {isSelected && <CheckIcon className='check-icon' />}
    </li>
  )
}
