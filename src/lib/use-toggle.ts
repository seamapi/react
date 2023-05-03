import { useCallback, useState } from 'react'

/**
 * Simple util to quickly handle on/off states.
 */
const useToggle = (initialState: boolean = false): [boolean, () => void] => {
  const [isTrue, setIsTrue] = useState(initialState)

  // use callback otherwise it would yield unexpected results in promises

  const toggle = useCallback(() => {
    setIsTrue((isTrue) => !isTrue)
  }, [setIsTrue])

  return [isTrue, toggle]
}

export default useToggle
