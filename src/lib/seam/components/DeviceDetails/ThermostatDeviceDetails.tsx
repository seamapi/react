import classNames from 'classnames'
import { useState, type PropsWithChildren } from 'react'
import type { ThermostatDevice } from 'seamapi'

import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { Tooltip } from 'lib/ui/Tooltip/Tooltip.js'
import { ChevronWideIcon } from 'lib/icons/ChevronWide.js'
import { ClimateSettingStatus } from 'lib/ui/thermostat/ClimateSettingStatus.js'

export function ThermostatDeviceDetails(props: {
  device: ThermostatDevice
  onBack?: () => void
  className?: string
}): JSX.Element | null {
  const { device, onBack, className } = props

  return (
    <div className={classNames('seam-device-details', className)}>
      <ContentHeader title='Thermostat' onBack={onBack} />
      <div className='seam-body'>
        {/* ThermostatCard */}

        <div className='seam-thermostat-details-sections'>
          <Section
            title='Scheduling'
            tooltipContent="Scheduled climates let you automatically change the thermostat's climate at a set time."
          >
            <div className='seam-thermostat-detail-row'>
              <p className='seam-thermostat-row-title'>11 Scheduled climates</p>
            </div>
          </Section>

          <Section
            title='Current settings'
            tooltipContent='These are the settings currently on the device. If you change them here, they change on the device.'
          >
            <AccordionRow
              title='Climate'
              triggerRightContent={
                <ClimateSettingStatus
                  climateSetting={device.properties.current_climate_setting}
                />
              }
            >
              Hi!
            </AccordionRow>
            <div className='seam-thermostat-detail-row'>
              <p className='seam-thermostat-row-title'>Fan mode</p>
            </div>
          </Section>

          <Section
            title='Default settings'
            tooltipContent='When a scheduled climate reaches its end time, the default settings will kick in.'
          />

          <Section title='Device details' />
        </div>
      </div>
    </div>
  )
}

interface SectionProps {
  title: string
  tooltipContent?: string
}

function Section({
  title,
  tooltipContent,
  children,
}: PropsWithChildren<SectionProps>) {
  return (
    <div className='seam-thermostat-detail-section'>
      <div className='seam-thermostat-detail-label-wrap'>
        <p className='seam-thermostat-detail-label'>{title}</p>
        {tooltipContent && <Tooltip>{tooltipContent}</Tooltip>}
      </div>

      <div className='seam-thermostat-detail-group'>{children}</div>
    </div>
  )
}

interface AccordionRowProps {
  title: string
  triggerRightContent?: JSX.Element
}

function AccordionRow({
  title,
  triggerRightContent,
  children,
}: PropsWithChildren<AccordionRowProps>) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpanded = () => {
    setIsExpanded((isExpanded) => !isExpanded)
  }

  return (
    <div className='seam-thermostat-accordion-row' aria-expanded={isExpanded}>
      <button
        className='seam-thermostat-accordion-row-trigger'
        onClick={toggleExpanded}
      >
        <p className='seam-thermostat-row-title'>{title}</p>
        <div className='seam-thermostat-row-inner-wrap'>
          <div className='seam-thermostat-row-trigger-right-content'>
            {triggerRightContent}
          </div>
          <div className='seam-thermostat-accordion-icon-wrap'>
            <ChevronWideIcon />
          </div>
        </div>
      </button>
      <div className='seam-thermostat-accordion-row-content'>
        <div className='seam-thermostat-accordion-row-inner-content'>
          {children}
        </div>
      </div>
    </div>
  )
}

const t = {}
