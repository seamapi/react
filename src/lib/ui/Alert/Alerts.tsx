import classNames from 'classnames'

import { Alert, type AlertProps } from 'lib/ui/Alert/Alert.js'

interface AlertsProps {
  alerts?: AlertProps[]
  children?: JSX.Element
  className?: string
}

export function Alerts(props: AlertsProps): JSX.Element | null {
  const { alerts, children, className } = props

  if (alerts?.length === 0) return null

  return (
    <div className={classNames('seam-alerts', className)}>
      {alerts?.map((alert, index) => (
        <Alert key={`${index}:${alert.message}`} {...alert} />
      ))}
      {children}
    </div>
  )
}
