import type { CareBrief } from '../lib/types'

interface Props {
  brief: CareBrief | null
  onToggleFollowUp: (id: string) => void
}

const urgencyClass: Record<CareBrief['urgency'], string> = {
  routine: 'u-routine',
  priority: 'u-priority',
  urgent: 'u-urgent',
}

export function BriefPanel({ brief, onToggleFollowUp }: Props) {
  if (!brief) {
    return (
      <section className="panel empty">
        <h2>Structured care brief</h2>
        <p className="muted">
          Generate from a sample to see symptoms, referral plan, and follow-up checklist in English for supervisors — while keeping the vernacular source.
        </p>
      </section>
    )
  }

  return (
    <section className="panel brief">
      <div className="panel-head">
        <h2>Structured care brief</h2>
        <span className={`badge ${urgencyClass[brief.urgency]}`}>{brief.urgency}</span>
      </div>

      <div className="meta-row">
        <div>
          <span className="label">Subject</span>
          <strong>{brief.patientAlias}</strong>
          {brief.villageHint ? <span className="muted"> · {brief.villageHint}</span> : null}
        </div>
        <div>
          <span className="label">Program</span>
          <strong>{brief.programArea}</strong>
        </div>
        <div>
          <span className="label">Engine</span>
          <strong>{brief.engine}</strong>
          {brief.offlineGenerated ? <span className="pill">offline</span> : null}
        </div>
      </div>

      <p className="summary">{brief.summaryEn}</p>

      {brief.redFlags.length > 0 && (
        <div className="alert">
          <strong>Red flags</strong>
          <ul>
            {brief.redFlags.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <h3>Symptoms / findings</h3>
      {brief.symptoms.length === 0 ? (
        <p className="muted">No lexicon hits — brief still stores the raw note for supervisor review.</p>
      ) : (
        <ul className="symptom-list">
          {brief.symptoms.map((s) => (
            <li key={s.code}>
              <div>
                <strong>{s.labelEn}</strong>
                <span className="conf">{Math.round(s.confidence * 100)}%</span>
              </div>
              <span className="evidence">evidence: {s.evidence.join(' · ')}</span>
            </li>
          ))}
        </ul>
      )}

      {brief.vitalsHints.length > 0 && (
        <>
          <h3>Vitals / measures to capture</h3>
          <ul className="plain">
            {brief.vitalsHints.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </>
      )}

      <h3>Referral</h3>
      <div className="referral-card">
        <div>
          <span className="label">Needed</span>
          <strong>{brief.referral.needed ? 'Yes' : 'No'}</strong>
        </div>
        <div>
          <span className="label">Facility</span>
          <strong>{brief.referral.facilityLevel}</strong>
        </div>
        <div>
          <span className="label">When</span>
          <strong>{brief.referral.timeframe}</strong>
        </div>
        <p>{brief.referral.reasonEn}</p>
      </div>

      <h3>Follow-up checklist</h3>
      <ul className="checklist">
        {brief.followUps.map((f) => (
          <li key={f.id}>
            <label>
              <input
                type="checkbox"
                checked={f.done}
                onChange={() => onToggleFollowUp(f.id)}
              />
              <span>
                <strong>{f.taskEn}</strong>
                <em>
                  {f.owner} · due in {f.dueInDays}d
                </em>
              </span>
            </label>
          </li>
        ))}
      </ul>

      <details className="source">
        <summary>Source note ({brief.sourceLang})</summary>
        <pre>{brief.sourceNote}</pre>
      </details>
    </section>
  )
}
