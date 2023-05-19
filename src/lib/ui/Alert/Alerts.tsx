import classNames from 'classnames'

import { Alert, type AlertProps } from 'lib/ui/Alert/Alert.js'

export interface AlertsProps {
  alerts?: AlertProps[]
  children?: React.ReactNode
  className?: string
}

export function Alerts(props: AlertsProps): JSX.Element {
  const { alerts, children, className, ...rest } = props

  return (
    <div className={classNames('seam-alerts', className)} {...rest}>
      {(alerts != null) &&
        alerts.map((alert) => <Alert key={alert.message} {...alert} />)}
      {children}
    </div>
  )
}
