import classNames from 'classnames'
import {
  type MouseEventHandler,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'

interface TabSetProps<TabType extends string> {
  tabs: TabType[]
  tabTitles: Record<TabType, string>
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

interface HighlightStyle {
  left: number
  width: number
}

export function TabSet<TabType extends string>({
  tabs,
  tabTitles,
  activeTab,
  onTabChange,
}: TabSetProps<TabType>): JSX.Element {
  const [highlightStyle, setHighlightStyle] = useState<HighlightStyle>({
    left: 0,
    width: 140,
  })

  const calculateHighlightStyle = useCallback(() => {
    const tabButton: HTMLButtonElement | null =
      globalThis.document?.querySelector(
        `.seam-tab-button:nth-of-type(${tabs.indexOf(activeTab) + 1})`
      )

    setHighlightStyle({
      left: tabButton?.offsetLeft ?? 0,
      width: tabButton?.offsetWidth ?? 140,
    })
  }, [activeTab, tabs])

  useLayoutEffect(() => {
    calculateHighlightStyle()
  }, [activeTab, calculateHighlightStyle])

  useEffect(() => {
    globalThis.addEventListener?.('resize', calculateHighlightStyle)
    return () => {
      globalThis.removeEventListener?.('resize', calculateHighlightStyle)
    }
  }, [calculateHighlightStyle])

  return (
    <div className='seam-tab-set'>
      <div className='seam-tab-set-buttons'>
        <div className='seam-tab-set-highlight' style={highlightStyle} />

        {tabs.map((tab) => (
          <TabButton<TabType>
            key={tab}
            tab={tab}
            title={tabTitles[tab]}
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
  title: string
  isActive: boolean
  onTabChange: (tab: TabType) => void
  setHighlightStyle: (style: HighlightStyle) => void
}

function TabButton<TabType extends string>({
  tab,
  title,
  isActive,
  onTabChange,
  setHighlightStyle,
}: TabButtonProps<TabType>): JSX.Element {
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
        type='button'
      onClick={handleClick}
    >
      <p className='seam-tab-button-label'>{title}</p>
    </button>
  )
}
