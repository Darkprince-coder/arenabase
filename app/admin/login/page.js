'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/ui/Logo'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import styles from './page.module.css'

export default function AdminLoginPage() {
  const router = useRouter()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim() || !password) return

    setLoading(true)
    setError('')

    const supabase = createSupabaseBrowserClient()

    const { error: authError } = await supabase.auth.signInWithPassword({
      email:    email.trim().toLowerCase(),
      password,
    })

    if (authError) {
      setError(
        authError.message === 'Invalid login credentials'
          ? 'Incorrect email or password.'
          : authError.message
      )
      setLoading(false)
      return
    }

    // Refresh to let the server-side session propagate, then navigate
    router.push('/admin')
    router.refresh()
  }

  const canSubmit = email.trim() && password && !loading

  return (
    <div className={styles.page}>
      {/* Ambient glow */}
      <div className={styles.glow} aria-hidden="true" />

      <main className={styles.card}>
        {/* Logo */}
        <div className={styles.logoRow}>
          <Logo size="md" />
        </div>

        <header className={styles.headingBlock}>
          <h1 className={styles.title}>Admin Login</h1>
          <p className={styles.subtitle}>Sign in to manage ARENABASE content</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Error */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Email */}
          <div className={styles.field}>
            <label htmlFor="admin-email" className={styles.label}>
              Email address
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={styles.input}
              placeholder="you@arenabase.co.ke"
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label htmlFor="admin-password" className={styles.label}>
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!canSubmit}
          >
            {loading ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className={styles.hint}>
          Admin access only. Contact the system administrator if you need access.
        </p>
      </main>
    </div>
  )
}
