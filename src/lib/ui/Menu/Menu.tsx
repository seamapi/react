import classNames from 'classnames'
import {
  createContext,
  type MouseEvent,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

export interface MenuProps {
  verticalOffset?: number
  horizontalOffset?: number
  edgeOffset?: number
  renderButton: (props: {
    onOpen: (event: MouseEvent<HTMLElement>) => void
  }) => JSX.Element
  backgroundProps?: Partial<{
    className?: string
  }>
}

interface MenuContextValue {
  close: () => void
}

const menuContext = createContext<MenuContextValue>({
  close: () => {},
})

export function Menu({
  verticalOffset = 5,
  horizontalOffset = 0,
  edgeOffset = 5,
  children,
  renderButton,
  backgroundProps,
}: PropsWithChildren<MenuProps>): JSX.Element | null {
  const { Provider } = menuContext
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [documentEl, setDocumentEl] = useState<null | Element>(null)
  const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null)
  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)

  useEffect(() => {
    const containers =
      globalThis?.document?.querySelectorAll('.seam-components')
    if (containers == null) return
    const el = containers[containers.length - 1]
    if (el != null) {
      setDocumentEl(el)
    }
  }, [setDocumentEl])

  const handleClose = (): void => {
    setAnchorEl(null)
  }

  const handleOpen = (event: MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const setPositions = useCallback(() => {
    if (anchorEl == null || contentEl == null || documentEl == null) return

    const { right: containerRight, bottom: containerBottom } =
      documentEl.getBoundingClientRect()

    const {
      top: anchorTop,
      left: anchorLeft,
      height: anchorHeight,
    } = anchorEl.getBoundingClientRect()

    const { width: contentWidth, height: contentHeight } =
      contentEl.getBoundingClientRect()

    const anchorBottom = anchorTop + anchorHeight

    const top = anchorBottom + verticalOffset
    const left = anchorLeft + horizontalOffset
    const right = left + contentWidth
    const bottom = top + contentHeight

    // If the content would overflow right, set it relative to the right of the container.
    const isOverflowingRight = right > containerRight
    const visibleLeft = isOverflowingRight
      ? containerRight - contentWidth - horizontalOffset - edgeOffset
      : left
    setLeft(visibleLeft)

    // If the content would overflow bottom, position it above the anchor.
    const isOverFlowingBottom = bottom > containerBottom
    const visibleTop = isOverFlowingBottom
      ? anchorTop - contentHeight - verticalOffset
      : top
    setTop(visibleTop)
  }, [
    anchorEl,
    horizontalOffset,
    verticalOffset,
    contentEl,
    documentEl,
    edgeOffset,
  ])

  useLayoutEffect(() => {
    setPositions()
    globalThis?.addEventListener('scroll', setPositions)
    globalThis?.addEventListener('resize', setPositions)
    return () => {
      globalThis?.removeEventListener('scroll', setPositions)
      globalThis?.removeEventListener('resize', setPositions)
    }
  }, [setPositions])

  const isOpen = anchorEl != null
  const hasSetPosition = top !== 0 && left !== 0
  const visible = isOpen && hasSetPosition

  if (documentEl == null) {
    return null
  }

  return (
    <Provider
      value={{
        close: handleClose,
      }}
    >
      {renderButton({ onOpen: handleOpen })}
      {createPortal(
        <div
          className={classNames(
            'seam-menu-bg',
            backgroundProps?.className,
            visible ? 'seam-menu-visible' : 'seam-menu-hidden'
          )}
          onClick={(event) => {
            event.stopPropagation()
            handleClose()
          }}
        >
          <div
            className='seam-menu-content'
            style={{
              top,
              left,
            }}
          >
            {children}
          </div>
        </div>,
        documentEl
      )}

      {/*
       * Render a shadow element to calculate the content size even if we're
       * not actually showing the content yet.
       */}
      <div className='seam-menu-shadow'>
        <div className='seam-menu-content' ref={setContentEl}>
          {children}
        </div>
      </div>
    </Provider>
  )
}

export function useMenu(): MenuContextValue {
  const context = useContext(menuContext)
  if (context == null) {
    throw new Error('useMenu must be used within a Menu.')
  }
  return context
}
