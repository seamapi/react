import { useEffect, useLayoutEffect, useRef } from 'react'

export function Picker({
  names,
  active,
  onChange,
  onReplay,
}: {
  names: string[]
  active: number
  onChange: (index: number) => void
  onReplay: () => void
}): JSX.Element {
  const nav = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const element = nav.current
    if (element == null) return
    const measure = (): void => {
      const button = element.querySelector<HTMLElement>('[data-active]')
      const highlight = element.querySelector<HTMLElement>(
        '.proto-picker-highlight'
      )
      if (button == null || highlight == null) return
      highlight.style.transform = `translateX(${button.offsetLeft}px)`
      highlight.style.width = `${button.offsetWidth}px`
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    let secondFrame = 0
    const frame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        element.dataset['ready'] = ''
      })
    })
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      cancelAnimationFrame(secondFrame)
    }
  }, [active])

  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      const target = event.target
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey ||
        (target instanceof HTMLElement &&
          (target.closest('input, textarea, select') != null ||
            target.isContentEditable))
      )
        return
      const number = Number(event.key)
      if (number >= 1 && number <= names.length) {
        event.preventDefault()
        onChange(number - 1)
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault()
        onChange(
          (active + (event.key === 'ArrowRight' ? 1 : names.length - 1)) %
            names.length
        )
      } else if (event.key.toLowerCase() === 'r') {
        event.preventDefault()
        onReplay()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
    }
  }, [active, names.length, onChange, onReplay])

  return (
    <nav ref={nav} className='proto-picker' aria-label='Prototype variants'>
      <span className='proto-picker-highlight' aria-hidden='true' />
      {names.map((name, index) => (
        <button
          key={name}
          type='button'
          className='proto-picker-item'
          data-active={index === active ? '' : undefined}
          aria-current={index === active ? 'true' : undefined}
          onClick={() => {
            onChange(index)
          }}
        >
          {name}
        </button>
      ))}
    </nav>
  )
}
