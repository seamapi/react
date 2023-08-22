import classNames from 'classnames'

import {
  useClimateSettingSchedules,
  type UseClimateSettingSchedulesData,
} from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedules.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { EmptyPlaceholder } from 'lib/ui/Table/EmptyPlaceholder.js'
import { TableBody } from 'lib/ui/Table/TableBody.js'
import { TableHeader } from 'lib/ui/Table/TableHeader.js'
import { TableTitle } from 'lib/ui/Table/TableTitle.js'
import { Caption } from 'lib/ui/typography/Caption.js'

import { compareByCreatedAtDesc } from 'lib/dates.js'
import { SearchTextField } from 'lib/ui/TextField/SearchTextField.js'
import { useMemo, useState } from 'react'
import type { ClimateSettingSchedule } from 'seamapi'
import { ClimateSettingScheduleRow } from './ClimateSettingScheduleRow.js'

export interface ClimateSettingScheduleTableProps {
  deviceId: string
  disableSearch?: boolean
  climateSettingScheduleFilter?: (
    climateSettingSchedule: ClimateSettingSchedule,
    searchInputValue: string
  ) => boolean
  climateSettingScheduleComparator?: (
    climateSettingScheduleA: ClimateSettingSchedule,
    climateSettingScheduleB: ClimateSettingSchedule
  ) => number
  onBack?: () => void
  heading?: string | null
  className?: string
}

const defaultClimateSettingScheduleFilter = (
  climateSettingSchedule: ClimateSettingSchedule,
  searchInputValue: string
): boolean => {
  const value = searchInputValue.trim().toLowerCase()
  if (value === '') return true
  const name = climateSettingSchedule.name ?? ''
  return name.trim().toLowerCase().includes(value)
}

export function ClimateSettingScheduleTable({
  deviceId,
  disableSearch = false,
  climateSettingScheduleFilter = defaultClimateSettingScheduleFilter,
  climateSettingScheduleComparator = compareByCreatedAtDesc,
  onBack,
  heading = t.climateSettingSchedules,
  className,
}: ClimateSettingScheduleTableProps): JSX.Element {
  const { climateSettingSchedules, isLoading, isError, error } =
    useClimateSettingSchedules({
      device_id: deviceId,
    })

  const [searchInputValue, setSearchInputValue] = useState('')

  const filteredClimateSettingSchedules = useMemo(
    () =>
      climateSettingSchedules
        ?.filter((schedule) =>
          climateSettingScheduleFilter(schedule, searchInputValue)
        )
        ?.sort(climateSettingScheduleComparator) ?? [],
    [
      climateSettingSchedules,
      searchInputValue,
      climateSettingScheduleFilter,
      climateSettingScheduleComparator,
    ]
  )

  if (isLoading) {
    return <p className={className}>...</p>
  }

  if (isError) {
    return <p className={className}>{error?.message}</p>
  }

  return (
    <div className={classNames('seam-table', className)}>
      <ContentHeader onBack={onBack} />
      <TableHeader>
        {heading != null ? (
          <TableTitle>
            {heading ?? t.climateSettingSchedules}{' '}
            <Caption>({filteredClimateSettingSchedules.length})</Caption>
          </TableTitle>
        ) : (
          <div className='seam-fragment' />
        )}
        {!disableSearch && (
          <SearchTextField
            value={searchInputValue}
            onChange={setSearchInputValue}
            disabled={(climateSettingSchedules?.length ?? 0) === 0}
          />
        )}
      </TableHeader>
      <TableBody>
        <Content
          climateSettingSchedules={filteredClimateSettingSchedules}
          onClimateSettingScheduleClick={() => {}}
        />
      </TableBody>
    </div>
  )
}

function Content(props: {
  climateSettingSchedules: Array<UseClimateSettingSchedulesData[number]>
  onClimateSettingScheduleClick: (climateSettingScheduleId: string) => void
}): JSX.Element {
  const { climateSettingSchedules, onClimateSettingScheduleClick } = props

  if (climateSettingSchedules.length === 0) {
    return (
      <EmptyPlaceholder>{t.noClimateSettingSchedulesMessage}</EmptyPlaceholder>
    )
  }

  return (
    <>
      {climateSettingSchedules.map((schedule) => (
        <ClimateSettingScheduleRow
          climateSettingSchedule={schedule}
          key={schedule.climate_setting_schedule_id}
          onClick={() => {
            onClimateSettingScheduleClick(schedule.climate_setting_schedule_id)
          }}
        />
      ))}
    </>
  )
}

const t = {
  climateSettingSchedules: 'Climate setting schedules',
  noClimateSettingSchedulesMessage:
    'Sorry, no climate setting schedules were found',
}
