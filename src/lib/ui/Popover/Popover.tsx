import {
  autoUpdate,
  flip,
  limitShift,
  offset,
  type ReferenceElement,
  shift,
  useFloating,
} from '@floating-ui/react'
import {
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import { seamComponentsClassName } from 'lib/seam/SeamProvider.js'

export interface PopoverInstance {
  show: () => void
  hide: () => void
  toggle: () => void
}

type PopoverChildren = (
  params: {
    setRef: (ref: HTMLElement | undefined | null) => void
  } & PopoverInstance
) => ReactNode

export interface PopoverProps {
  children: PopoverChildren
  content: ReactNode | ((instance: PopoverInstance) => ReactNode)
  instanceRef?: Ref<PopoverInstance>
  preventCloseOnClickOutside?: boolean
}

export function Popover(props: PopoverProps): JSX.Element {
  const { children, content, instanceRef, preventCloseOnClickOutside } = props

  const [open, setOpen] = useState(false)

  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    transform: false,
    open,
    onOpenChange: setOpen,
    placement: 'bottom',
    middleware: [
      shift({
        crossAxis: true,
        limiter: limitShift(),
      }),
      flip(),
      offset(5),
    ],
  })

  const referenceEl = useRef<HTMLElement | null>()
  const floatingEl = useRef<HTMLElement | null>()

  const setFLoating = useCallback(
    (ref: HTMLElement | null): void => {
      refs.setFloating(ref)
      floatingEl.current = ref
    },
    [refs, floatingEl]
  )

  const toggle = useCallback(() => {
    setOpen((value) => !value)
  }, [])

  const instance = useMemo(
    () => ({
      show: () => {
        setOpen(true)
      },
      hide: () => {
        setOpen(false)
      },
      toggle,
    }),
    [toggle]
  )

  const setReference = useCallback(
    (ref: ReferenceElement | undefined | null): void => {
      if (!(ref instanceof HTMLElement) || referenceEl.current === ref) return

      if (referenceEl.current != null) {
        referenceEl.current.removeEventListener('click', toggle)
      }

      refs.setReference(ref)
      ref.addEventListener('click', toggle)
      referenceEl.current = ref
    },
    [toggle, refs]
  )

  useImperativeHandle(instanceRef, () => instance)

  /**
   * Closes the popover when the user clicks outside of it.
   */
  const windowClickHandler = useCallback((e: MouseEvent): void => {
    const target = e.target as HTMLElement

    // If the target is the reference element, do nothing.
    if (
      referenceEl.current === target ||
      referenceEl.current?.contains(target) === true
    ) {
      return
    }

    const closest = target.closest('[data-seam-popover]')

    // Prevents closing if target is floating element, also adds support for nested popovers somehow :)
    if (
      closest != null &&
      referenceEl.current != null &&
      !closest.contains(referenceEl.current)
    ) {
      return
    }

    setOpen(false)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (preventCloseOnClickOutside === false) return

      globalThis.addEventListener('click', windowClickHandler)
    }, 0)

    return () => {
      globalThis.removeEventListener('click', windowClickHandler)
    }
  }, [windowClickHandler, preventCloseOnClickOutside])

  return (
    <>
      {children({ setRef: setReference, ...instance })}
      {open &&
        createPortal(
          <div
            className={seamComponentsClassName}
            data-seam-popover=''
            ref={setFLoating}
            style={floatingStyles}
          >
            <div className='seam-popover'>
              {typeof content === 'function' ? content(instance) : content}
            </div>
          </div>,
          globalThis.document.body
        )}
    </>
  )
}
