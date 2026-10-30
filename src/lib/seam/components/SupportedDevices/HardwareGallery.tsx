import { useEffect, useId, useRef, useState } from 'react'

import type {
  DeviceImage,
  DeviceModelSummary,
} from 'lib/seam/ecosystem/types.js'

interface GalleryImage {
  image: DeviceImage
  label: string
}

export function HardwareGallery({
  source,
  name,
}: {
  source: DeviceModelSummary
  name: string
}): JSX.Element {
  const seen = new Set<string>()
  const photos: GalleryImage[] = []
  for (const variant of source.variants)
    for (const image of variant.images) {
      if (seen.has(image.url)) continue
      seen.add(image.url)
      photos.push({
        image,
        label: [variant.color_name, variant.style_name]
          .filter(Boolean)
          .join(' · '),
      })
    }
  if (photos.length === 0 && source.featured_image != null)
    photos.push({ image: source.featured_image, label: name })
  const swatches = source.variants
    .filter(
      (variant) =>
        variant.color_name != null || variant.primary_color_hex != null
    )
    .map((variant) => ({
      label: variant.color_name ?? 'Color not specified',
      color: variant.primary_color_hex,
      index: photos.findIndex((photo) =>
        variant.images.some((image) => image.url === photo.image.url)
      ),
    }))
    .filter(
      (swatch, index, all) =>
        all.findIndex(
          (entry) =>
            entry.label === swatch.label && entry.color === swatch.color
        ) === index
    )

  const [selected, setSelected] = useState<number | null>(null)
  const [hovered, setHovered] = useState<{
    index: number
    left: number
    top: number
  } | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const current = selected == null ? null : photos[selected]
  const hoverPhoto = hovered == null ? null : photos[hovered.index]

  useEffect(() => {
    if (selected != null && dialog.current != null && !dialog.current.open)
      dialog.current.showModal()
  }, [selected])

  useEffect(() => {
    if (hovered == null) return
    const dismiss = (): void => {
      setHovered(null)
    }
    window.addEventListener('scroll', dismiss, true)
    window.addEventListener('resize', dismiss)
    return () => {
      window.removeEventListener('scroll', dismiss, true)
      window.removeEventListener('resize', dismiss)
    }
  }, [hovered])

  const move = (direction: number): void => {
    setSelected((index) =>
      index == null ? null : (index + direction + photos.length) % photos.length
    )
  }

  return (
    <div className='seam-supported-device-gallery'>
      {swatches.length > 0 ? (
        <div
          className='seam-supported-device-gallery-swatches'
          role='group'
          aria-label={`${name} colors and photos`}
        >
          {swatches.map(({ color, label, index }) => (
            <button
              key={`${color ?? ''}-${label}`}
              type='button'
              className='seam-supported-device-gallery-swatch'
              aria-label={`View ${name} in ${label}`}
              title={`${label} · ${index < 0 ? 'Photos unavailable' : 'View photos'}`}
              disabled={index < 0}
              onPointerEnter={(event) => {
                if (
                  index < 0 ||
                  event.pointerType !== 'mouse' ||
                  window.innerWidth <= 600
                )
                  return
                const rect = event.currentTarget.getBoundingClientRect()
                const style = getComputedStyle(document.documentElement)
                const measuredTop = parseFloat(
                  style.getPropertyValue('--seam-supported-device-viewport-top')
                )
                const measuredHeight = parseFloat(
                  style.getPropertyValue(
                    '--seam-supported-device-viewport-height'
                  )
                )
                const viewportTop = Number.isFinite(measuredTop)
                  ? measuredTop
                  : 0
                const viewportHeight =
                  Number.isFinite(measuredHeight) && measuredHeight > 0
                    ? measuredHeight
                    : window.innerHeight
                const size = 280
                const nextTo =
                  rect.right + 12 + size < window.innerWidth - 16
                    ? rect.right + 12
                    : rect.left - size - 12
                setHovered({
                  index,
                  left: Math.max(16, nextTo),
                  top: Math.max(
                    viewportTop + 16,
                    Math.min(
                      rect.top - 100,
                      viewportTop + viewportHeight - size - 56
                    )
                  ),
                })
              }}
              onPointerLeave={() => {
                setHovered(null)
              }}
              onClick={() => {
                setHovered(null)
                setSelected(index)
              }}
            >
              <span
                className='seam-supported-device-gallery-color'
                style={{ backgroundColor: color ?? undefined }}
                data-unknown={color == null ? '' : undefined}
              />
            </button>
          ))}
          {photos.length > 0 && swatches.every(({ index }) => index < 0) && (
            <button
              type='button'
              className='seam-supported-device-gallery-photos'
              onClick={() => {
                setSelected(0)
              }}
            >
              View photos
            </button>
          )}
        </div>
      ) : photos.length > 0 ? (
        <button
          type='button'
          className='seam-supported-device-gallery-photos'
          onClick={() => {
            setSelected(0)
          }}
        >
          View photos
        </button>
      ) : (
        <span className='seam-supported-device-muted'>Not listed</span>
      )}
      {hovered != null && hoverPhoto != null && (
        <div
          className='seam-supported-device-gallery-hover'
          style={{ left: hovered.left, top: hovered.top }}
          aria-hidden
        >
          <img
            src={largeImage(hoverPhoto.image)}
            alt=''
            width='280'
            height='280'
          />
          <span>{hoverPhoto.label === '' ? name : hoverPhoto.label}</span>
        </div>
      )}
      <dialog
        ref={dialog}
        className='seam-supported-device-gallery-dialog'
        aria-labelledby={titleId}
        onClose={() => {
          setSelected(null)
          setHovered(null)
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close()
        }}
        onKeyDown={(event) => {
          event.stopPropagation()
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault()
            move(event.key === 'ArrowLeft' ? -1 : 1)
          }
        }}
      >
        {current != null && (
          <>
            <header>
              <h4 id={titleId}>{name}</h4>
              <button
                type='button'
                aria-label='Close image'
                onClick={() => dialog.current?.close()}
              >
                <svg
                  aria-hidden
                  width='18'
                  height='18'
                  viewBox='0 0 20 20'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.5'
                >
                  <path d='m5 5 10 10M15 5 5 15' strokeLinecap='round' />
                </svg>
              </button>
            </header>

            <img
              className='seam-supported-device-gallery-large-image'
              src={largeImage(current.image)}
              alt={`${name}${current.label === '' ? '' : ` · ${current.label}`}`}
            />
            <footer>
              <button
                type='button'
                aria-label='Previous image'
                disabled={photos.length < 2}
                onClick={() => {
                  move(-1)
                }}
              >
                ←
              </button>
              <span>
                {current.label === '' ? name : current.label} ·{' '}
                {(selected ?? 0) + 1} / {photos.length}
              </span>
              <button
                type='button'
                aria-label='Next image'
                disabled={photos.length < 2}
                onClick={() => {
                  move(1)
                }}
              >
                →
              </button>
            </footer>
          </>
        )}
      </dialog>
    </div>
  )
}

function largeImage(image: DeviceImage): string {
  return image.formats.large?.url ?? image.formats.medium?.url ?? image.url
}
