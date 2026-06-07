import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import AdminFormLayout from '@/components/admin/AdminFormLayout'
import ResultForm from '@/components/admin/ResultForm'
import DeleteButton from '@/components/admin/DeleteButton'
import { publishResult, deleteResult } from '../../actions'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { id } = await params
  return { title: `Publish Result` }
}

export default async function PublishResultPage({ params }) {
  /* id = fixture UUID (linked from the results list) */
  const { id: fixtureId } = await params

  const admin = createAdminClient()

  /* Load fixture details + any existing result in parallel */
  const [
    { data: fixture },
    { data: existingResult },
  ] = await Promise.all([
    admin
      .from('fixtures')
      .select(`
        id, kickoff_time, round, status,
        home_team:home_team_id(id, name, slug, logo_public_id),
        away_team:away_team_id(id, name, slug, logo_public_id),
        venue:venue_id(name),
        tournament:tournament_id(name, slug)
      `)
      .eq('id', fixtureId)
      .single(),

    admin
      .from('results')
      .select('id, home_score, away_score, notes, published_at')
      .eq('fixture_id', fixtureId)
      .maybeSingle(),
  ])

  if (!fixture) notFound()

  const isEdit        = Boolean(existingResult)
  const publishAction = publishResult.bind(null, fixtureId)
  const deleteAction  = existingResult
    ? deleteResult.bind(null, existingResult.id)
    : null

  return (
    <AdminFormLayout
      title={isEdit ? 'Edit Result' : 'Publish Result'}
      subtitle={
        `${fixture.home_team?.name ?? '?'} vs ${fixture.away_team?.name ?? '?'}` +
        (fixture.tournament?.name ? ` — ${fixture.tournament.name}` : '')
      }
      backHref="/admin/results"
      backLabel="Back to Results"
    >
      {/* ── Scoreboard form ─────────────────── */}
      <ResultForm
        action={publishAction}
        fixture={fixture}
        existingResult={existingResult}
      />

      {/* ── Danger zone (only when editing) ─── */}
      {isEdit && deleteAction && (
        <div className={styles.dangerZone}>
          <div className={styles.dangerInfo}>
            <h2 className={styles.dangerTitle}>Danger Zone</h2>
            <p className={styles.dangerDesc}>
              Removing this result unpublishes the score from the public site.
              The fixture remains marked as completed.
            </p>
          </div>
          <DeleteButton
            action={deleteAction}
            itemName="this result"
            label="Remove Result"
          />
        </div>
      )}
    </AdminFormLayout>
  )
}
