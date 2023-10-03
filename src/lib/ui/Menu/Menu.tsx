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

import { seamComponentsClassName } from 'lib/seam/SeamProvider.js'

export interface MenuProps extends PropsWithChildren {
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

interface MenuContext {
  close: () => void
}

const menuContext = createContext<MenuContext>({
  close: () => {},
})

export function Menu({
  verticalOffset = 5,
  horizontalOffset = 0,
  edgeOffset = 5,
  children,
  renderButton,
  backgroundProps,
}: MenuProps): JSX.Element | null {
  const { Provider } = menuContext
  const [documentEl, setDocumentEl] = useState<null | HTMLElement>(null)
  const [bodyEl, setBodyEl] = useState<null | HTMLElement>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null)
  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)

  useEffect(() => {
    const documentEl = globalThis.document.documentElement
    setDocumentEl(documentEl)

    const bodyElements = documentEl?.getElementsByTagName('body')
    if (bodyElements.length === 0) return
    setBodyEl(bodyElements[0] as HTMLElement)
  }, [setDocumentEl])

  const handleClose = (): void => {
    setAnchorEl(null)
  }

  const handleOpen = (event: MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const setPositions = useCallback(() => {
    if (
      anchorEl == null ||
      contentEl == null ||
      bodyEl == null ||
      documentEl == null
    )
      return

    const containerRight = documentEl.offsetLeft + documentEl.clientWidth
    const containerBottom = documentEl.offsetTop + documentEl.clientHeight

    const anchorBox = anchorEl.getBoundingClientRect()
    const anchorTop = anchorBox.top + bodyEl.clientTop
    const anchorLeft = anchorBox.left + bodyEl.clientLeft
    const anchorHeight = anchorEl.offsetHeight

    const contentWidth = contentEl.offsetWidth
    const contentHeight = contentEl.offsetHeight

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
    const topWhenAboveAnchor = anchorTop - contentHeight - verticalOffset

    // Only open the menu above the anchor if it won't get clipped, i.e., not < 0.
    const visibleTop =
      isOverFlowingBottom && topWhenAboveAnchor > 0 ? topWhenAboveAnchor : top
    setTop(visibleTop)
  }, [
    anchorEl,
    horizontalOffset,
    verticalOffset,
    contentEl,
    edgeOffset,
    bodyEl,
    documentEl,
  ])

  useLayoutEffect(() => {
    setPositions()
    globalThis.addEventListener('scroll', setPositions)
    globalThis.addEventListener('resize', setPositions)
    return () => {
      globalThis.removeEventListener('scroll', setPositions)
      globalThis.removeEventListener('resize', setPositions)
    }
  }, [setPositions])

  const isOpen = anchorEl != null
  const hasSetPosition = top !== 0 && left !== 0
  const visible = isOpen && hasSetPosition

  if (bodyEl == null) {
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
        <div className={seamComponentsClassName}>
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
          </div>
        </div>,
        bodyEl
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

export function useMenu(): MenuContext {
  return useContext(menuContext)
}
