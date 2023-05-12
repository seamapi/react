import React from 'react'

import {
  NavigationContext,
  type NavigationContextProps,
} from 'lib/NavigationProvider.js'

export function useNavigation(): NavigationContextProps {
  const context = React.useContext(NavigationContext)
  if (context === undefined) {
    return {
      show: () => {},
      goBack: undefined,
    }
  }

  return context
}
