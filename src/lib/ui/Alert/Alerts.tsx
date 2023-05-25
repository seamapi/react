import classNames from 'classnames'

import { Alert, type AlertProps } from 'lib/ui/Alert/Alert.js'

export interface AlertsProps {
  alerts?: AlertProps[]
  children?: JSX.Element
  className?: string
}

export function Alerts(props: AlertsProps): JSX.Element {
  const { alerts, children, className } = props

  return (
    <div className={classNames('seam-alerts', className)}>
      {alerts?.map((alert, index) => (
        <Alert key={`${index}:${alert.message}`} {...alert} />
      ))}
      {children}
    </div>
  )
}
