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
    <div className='seam-proto-gallery'>
      {photos.length === 0 ? (
        <p className='seam-proto-gallery-hint'>Photos aren’t available yet.</p>
      ) : (
        <>
          <div
            className='seam-proto-gallery-thumbnails'
            aria-label={`${name} photos`}
          >
            {photos.map(({ image, label }, index) => (
              <button
                key={image.url}
                type='button'
                className='seam-proto-gallery-thumbnail'
                aria-label={`Enlarge ${name}${label === '' ? '' : ` · ${label}`} · photo ${index + 1} of ${photos.length}`}
                onPointerEnter={(event) => {
                  if (event.pointerType !== 'mouse' || window.innerWidth <= 600)
                    return
                  const rect = event.currentTarget.getBoundingClientRect()
                  const size = 280
                  const nextTo =
                    rect.right + 12 + size < window.innerWidth - 16
                      ? rect.right + 12
                      : rect.left - size - 12
                  setHovered({
                    index,
                    left: Math.max(16, nextTo),
                    top: Math.max(
                      16,
                      Math.min(rect.top - 100, window.innerHeight - size - 56)
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
                <img
                  src={
                    image.formats.thumbnail?.url ??
                    image.formats.small?.url ??
                    image.url
                  }
                  alt=''
                  width='48'
                  height='48'
                  loading='lazy'
                />
              </button>
            ))}
          </div>
          <p className='seam-proto-gallery-hint'>
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'} · Hover
            or tap to enlarge.
          </p>
        </>
      )}
      {hovered != null && hoverPhoto != null && (
        <div
          className='seam-proto-gallery-hover'
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
        className='seam-proto-gallery-dialog'
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
        {current != null && (
          <>
            <img
              className='seam-proto-gallery-large-image'
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
