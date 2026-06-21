"use client"

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './TournamentForm.module.css'

export default function TeamMultiSelect({ tournamentId = null, disabled = false }) {
  const [teams, setTeams] = useState([])
  const [selected, setSelected] = useState([])
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data } = await supabase.from('teams').select('id, name').order('name')
        if (!mounted) return
        setTeams(data ?? [])
      } catch (e) {
        // ignore
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!tournamentId) return
    let mounted = true
    ;(async () => {
      try {
        const { data } = await supabase
          .from('tournament_teams')
          .select('team_id')
          .eq('tournament_id', tournamentId)

        if (!mounted) return
        setSelected((data ?? []).map(d => d.team_id))
      } catch (e) {
        // ignore
      }
    })()
    return () => { mounted = false }
  }, [tournamentId])

  useEffect(() => {
    function onDoc(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  const filtered = teams.filter(t => t.name.toLowerCase().includes(query.toLowerCase()) && !selected.includes(t.id))

  function add(id) {
    if (disabled) return
    setSelected(prev => [...prev, id])
    setQuery('')
    setOpen(false)
  }

  function remove(id) {
    if (disabled) return
    setSelected(prev => prev.filter(p => p !== id))
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        {selected.map(id => {
          const t = teams.find(x => x.id === id)
          return (
            <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 6 }}>
              <span style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>{t?.name ?? id}</span>
              <button type="button" disabled={disabled} onClick={() => remove(id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontWeight: 700 }}>×</button>
            </span>
          )
        })}
      </div>

      <input
        className={styles.input}
        placeholder="Search teams to add…"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        disabled={disabled}
        aria-label="Search teams"
      />

      {open && filtered.length > 0 && (
        <div style={{ position: 'absolute', zIndex: 40, left: 0, right: 0, background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 8, marginTop: 8, maxHeight: 220, overflow: 'auto' }} role="listbox">
          {filtered.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => add(t.id)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      {/* Hidden inputs for form submission */}
      {selected.map(id => (
        <input key={id} type="hidden" name="team_ids[]" value={id} />
      ))}
    </div>
  )
}
