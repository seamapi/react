import type { ElementProps } from 'lib/element.js'

import type { ConnectAccountButtonProps } from './ConnectAccountButton.js'

export const name = 'seam-connect-account-button'

export const props: ElementProps<ConnectAccountButtonProps> = {
  className: 'string',
}

export { ConnectAccountButton as Component } from './ConnectAccountButton.js'
