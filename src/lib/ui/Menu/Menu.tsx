import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface MenuProps {
  children: JSX.Element | JSX.Element[]
  verticalOffset?: number
  horizontalOffset?: number
  button: (props: {
    open: (event: React.MouseEvent<HTMLElement>) => void
  }) => React.ReactElement
}

const Menu = ({
  verticalOffset = 5,
  horizontalOffset = 0,
  children,
  button,
}: MenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [documentEl, setDocumentEl] = useState<null | Element>(null)
  const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null)
  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)

  useEffect(() => {
    const el = document.querySelector('.seam-components')
    if (el != null) {
      setDocumentEl(el)
    }
  }, [setDocumentEl])

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = (event: React.MouseEvent<HTMLElement>) => {
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

    // If the content would overflow right, we'll need to set it relative
    // to the right of the container.
    const isOverflowingRight = right > containerRight
    const visibleLeft = isOverflowingRight
      ? containerRight - contentWidth - horizontalOffset
      : left
    setLeft(visibleLeft)

    // If the content would overflow bottom, we'll position it to be
    // above the anchor.
    const isOverFlowingBottom = bottom > containerBottom
    const visibleTop = isOverFlowingBottom
      ? anchorTop - contentHeight - verticalOffset
      : top
    setTop(visibleTop)
  }, [anchorEl, horizontalOffset, verticalOffset, contentEl, documentEl])

  const isOpen = Boolean(anchorEl)

  useLayoutEffect(() => {
    setPositions()
    window.addEventListener('scroll', setPositions)
    window.addEventListener('resize', setPositions)
    return () => {
      window.removeEventListener('scroll', setPositions)
      window.removeEventListener('resize', setPositions)
    }
  }, [setPositions])

  const hasSetPosition = top !== 0 && left !== 0
  const visible = isOpen && hasSetPosition

  if (documentEl == null) {
    return null
  }

  return (
    <>
      {button({ open })}
      {createPortal(
        <div
          className='seam-menu-bg'
          style={{
            display: visible ? 'flex' : 'none',
          }}
          onClick={(e) => {
            e.stopPropagation()
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
    </>
  )
}

export default Menu
