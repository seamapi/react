import classNames from 'classnames'
import {
  type MouseEventHandler,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'

interface TabSetProps<TabType> {
  tabs: TabType[]
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

interface HighlightStyle {
  left: number
  width: number
}

export function TabSet<TabType extends string>({
  tabs,
  activeTab,
  onTabChange,
}: TabSetProps<TabType>) {
  const [highlightStyle, setHighlightStyle] = useState<HighlightStyle>({
    left: 0,
    width: 140,
  })

  const calculateHighlightStyle = useCallback(() => {
    const tabButton: HTMLButtonElement | null = document.querySelector(
      `.seam-tab-button:nth-of-type(${tabs.indexOf(activeTab) + 1})`
    )

    setHighlightStyle({
      left: tabButton?.offsetLeft ?? 0,
      width: tabButton?.offsetWidth ?? 140,
    })
  }, [activeTab, tabs])

  useLayoutEffect(() => {
    calculateHighlightStyle()
  }, [activeTab])

  useEffect(() => {
    const handleResize = () => { calculateHighlightStyle(); }
    window.addEventListener('resize', handleResize)
    return () => { window.removeEventListener('resize', handleResize); }
  }, [])

  return (
    <div className='seam-tab-set'>
      <div className='seam-tab-set-buttons'>
        <div className='seam-tab-set-highlight' style={highlightStyle} />

        {tabs.map((tab) => (
          <TabButton<TabType>
            key={tab}
            tab={tab}
            isActive={activeTab === tab}
            onTabChange={onTabChange}
            setHighlightStyle={setHighlightStyle}
          />
        ))}
      </div>
    </div>
  )
}

interface TabButtonProps<TabType> {
  tab: TabType
  isActive: boolean
  onTabChange: (tab: TabType) => void
  setHighlightStyle: (style: HighlightStyle) => void
}

function TabButton<TabType extends string>({
  tab,
  isActive,
  onTabChange,
  setHighlightStyle,
}: TabButtonProps<TabType>) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (ev) => {
    onTabChange(tab)
    setHighlightStyle({
      left: ev.currentTarget.offsetLeft,
      width: ev.currentTarget.offsetWidth,
    })
  }

  return (
    <button
      className={classNames(
        'seam-tab-button',
        isActive && 'seam-tab-button-active'
      )}
      onClick={handleClick}
    >
      <p className='seam-tab-button-label'>{tab}</p>
    </button>
  )
}
