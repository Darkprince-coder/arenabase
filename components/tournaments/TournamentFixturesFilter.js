'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import styles from './TournamentTabs.module.css'

const DATE_TABS = [
  { label: 'Upcoming',    value: 'upcoming' },
  { label: 'Today',       value: 'today' },
  { label: 'This Week',   value: 'this-week' },
  { label: 'This Month',  value: 'this-month' },
  { label: 'Past',        value: 'past' },
]

export default function TournamentFixturesFilter({ slug }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const activeDate = searchParams.get('date') || 'upcoming'

  function buildUrl(overrides) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(overrides).forEach(([k, v]) => {
      if (!v || v === 'fixtures') params.delete(k)
      else params.set(k, v)
    })
    const qs = params.toString()
    return `/tournaments/${slug}${qs ? `?${qs}` : ''}`
  }

  function navigate(overrides) {
    startTransition(() => router.push(buildUrl(overrides)))
  }

  return (
    <div className={`${styles.tabsRow} ${isPending ? styles.pending : ''}`} role="tablist" aria-label="Filter fixtures">
      {DATE_TABS.map(tab => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={activeDate === tab.value}
          className={`${styles.tab} ${activeDate === tab.value ? styles.tabActive : ''}`}
          onClick={() => navigate({ date: tab.value })}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
