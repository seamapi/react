import classNames from 'classnames'
import { useCallback, useMemo, useState } from 'react'

import { compareByCreatedAtDesc } from 'lib/dates.js'

// import {
//   useClimateSettingSchedules,
//   type UseClimateSettingSchedulesData,
// } from 'lib/seam/ClimateSettingSchedules/use-ClimateSettingSchedules.js'
import { EmptyPlaceholder } from 'lib/ui/Table/EmptyPlaceholder.js'
import { TableBody } from 'lib/ui/Table/TableBody.js'
import { TableHeader } from 'lib/ui/Table/TableHeader.js'
import { TableTitle } from 'lib/ui/Table/TableTitle.js'
import { SearchTextField } from 'lib/ui/TextField/SearchTextField.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { Caption } from 'lib/ui/typography/Caption.js'
import type { ClimateSettingSchedule } from 'seamapi'
import type { AccountFilter } from '../DeviceTable/DeviceHealthBar.js'
import { ClimateSettingScheduleRow } from './ClimateSettingScheduleRow.js'

// type ClimateSettingSchedule = UseClimateSettingSchedulesData[number]

export interface ClimateSettingScheduleTableProps {
  climateSettingScheduleIds?: string[]
  connectedAccountIds?: string[]
  disableLockUnlock?: boolean
  disableSearch?: boolean
  climateSettingScheduleFilter?: (
    ClimateSettingSchedule: ClimateSettingSchedule,
    searchInputValue: string
  ) => boolean
  climateSettingScheduleComparator?: (
    ClimateSettingScheduleA: ClimateSettingSchedule,
    ClimateSettingScheduleB: ClimateSettingSchedule
  ) => number
  onClimateSettingScheduleClick?: (ClimateSettingScheduleId: string) => void
  preventDefaultOnClimateSettingScheduleClick?: boolean
  onBack?: () => void
  className?: string
}

const defaultClimateSettingScheduleFilter = (
  ClimateSettingSchedule: ClimateSettingSchedule,
  searchInputValue: string
): boolean => {
  const value = searchInputValue.trim()
  if (value === '') return true
  return new RegExp(value, 'i').test(
    ClimateSettingSchedule.properties.name ?? ''
  )
}

export function ClimateSettingScheduleTable({
  climateSettingScheduleIds,
  connectedAccountIds,
  disableLockUnlock = false,
  disableSearch = false,
  onClimateSettingScheduleClick = () => {},
  preventDefaultOnClimateSettingScheduleClick = false,
  onBack,
  climateSettingScheduleFilter = defaultClimateSettingScheduleFilter,
  climateSettingScheduleComparator = compareByCreatedAtDesc,
  className,
}: ClimateSettingScheduleTableProps = {}): JSX.Element {
  const { ClimateSettingSchedules, isLoading, isError, error } =
    useClimateSettingSchedules({
      climate_setting_schedule_ids: climateSettingScheduleIds,
      connected_account_ids: connectedAccountIds,
    })

  const [
    selectedClimateSettingScheduleId,
    setSelectedClimateSettingScheduleId,
  ] = useState<string | null>(null)
  const [searchInputValue, setSearchInputValue] = useState('')

  const filteredClimateSettingSchedules = useMemo(
    () =>
      ClimateSettingSchedules?.filter((schedule) =>
        climateSettingScheduleFilter(schedule, searchInputValue)
      )?.sort(climateSettingScheduleComparator) ?? [],
    [
      ClimateSettingSchedules,
      searchInputValue,
      climateSettingScheduleFilter,
      climateSettingScheduleComparator,
    ]
  )

  const handleClimateSettingScheduleClick = useCallback(
    (climateSettingScheduleId: string): void => {
      onClimateSettingScheduleClick(climateSettingScheduleId)
      if (preventDefaultOnClimateSettingScheduleClick) return
      setSelectedClimateSettingScheduleId(climateSettingScheduleId)
    },
    [
      onClimateSettingScheduleClick,
      preventDefaultOnClimateSettingScheduleClick,
      setSelectedClimateSettingScheduleId,
    ]
  )

  // if (selectedClimateSettingScheduleId != null) {
  //   return (
  //     <ClimateSettingScheduleDetails
  //       className={className}
  //       ClimateSettingScheduleId={selectedClimateSettingScheduleId}
  //       onBack={() => {
  //         setSelectedClimateSettingScheduleId(null)
  //       }}
  //       disableLockUnlock={disableLockUnlock}
  //     />
  //   )
  // }

  if (isLoading) {
    return <p className={className}>...</p>
  }

  if (isError) {
    return <p className={className}>{error?.message}</p>
  }

  return (
    <div className={classNames('seam-ClimateSettingSchedule-table', className)}>
      <ContentHeader onBack={onBack} />
      <TableHeader>
        <TableTitle>
          {t.ClimateSettingSchedules}{' '}
          <Caption>({filteredClimateSettingSchedules.length})</Caption>
        </TableTitle>
        {!disableSearch && (
          <SearchTextField
            value={searchInputValue}
            onChange={setSearchInputValue}
            disabled={(ClimateSettingSchedules?.length ?? 0) === 0}
          />
        )}
      </TableHeader>
      <TableBody>
        <Content
          ClimateSettingSchedules={filteredClimateSettingSchedules}
          onClimateSettingScheduleClick={handleClimateSettingScheduleClick}
        />
      </TableBody>
    </div>
  )
}

function Content(props: {
  ClimateSettingSchedules: Array<UseClimateSettingSchedulesData[number]>
  onClimateSettingScheduleClick: (ClimateSettingScheduleId: string) => void
}): JSX.Element {
  const { ClimateSettingSchedules, onClimateSettingScheduleClick } = props
  const [filter, setFilter] = useState<
    AccountFilter | ClimateSettingScheduleFilter | null
  >(null)

  if (ClimateSettingSchedules.length === 0) {
    return (
      <EmptyPlaceholder>{t.noClimateSettingSchedulesMessage}</EmptyPlaceholder>
    )
  }

  const filteredClimateSettingSchedules = ClimateSettingSchedules.filter(
    (ClimateSettingSchedule) => {
      if (filter === null) {
        return true
      }

      if (filter === 'account_issues') {
        return (
          ClimateSettingSchedule.errors.filter(
            (error) => 'is_connected_account_error' in error
          ).length > 0
        )
      }

      if (filter === 'ClimateSettingSchedule_issues') {
        return (
          ClimateSettingSchedule.errors.filter(
            (error) => 'is_ClimateSettingSchedule_error' in error
          ).length > 0
        )
      }

      return true
    }
  )

  return (
    <>
      {/* <ClimateSettingScheduleHealthBar
        ClimateSettingSchedules={ClimateSettingSchedules}
        filter={filter}
        onFilterSelect={setFilter}
      /> */}
      {filteredClimateSettingSchedules.map((schedule) => (
        <ClimateSettingScheduleRow
          climateSettingSchedule={schedule}
          key={schedule.ClimateSettingSchedule_id}
          onClick={() => {
            onClimateSettingScheduleClick(schedule.ClimateSettingSchedule_id)
          }}
        />
      ))}
    </>
  )
}

const t = {
  climateSettingSchedules: 'climateSettingSchedules',
  noClimateSettingSchedulesMessage:
    'Sorry, no climate setting schedules were found',
}
