import type { CareHubPayload } from '../lib/types'

interface Props {
  payload: CareHubPayload | null
  queue: CareHubPayload[]
  onQueue: () => void
  onSimulatePost: () => void
  onClear: () => void
}

export function CareHubPanel({
  payload,
  queue,
  onQueue,
  onSimulatePost,
  onClear,
}: Props) {
  return (
    <section className="panel carehub">
      <div className="panel-head">
        <h2>xSpan CareHub adapter</h2>
        <span className="pill mock">MOCK</span>
      </div>
      <p className="honesty">
        Honest stub for judges: we shape a care-coordination JSON event and store it in an offline
        queue. <strong>No live CareHub / xSpan API is called</strong> in this thin demo. Wire-up
        path is documented for a later real adapter.
      </p>
      <div className="row-actions">
        <button type="button" className="btn primary" disabled={!payload} onClick={onQueue}>
          Queue locally
        </button>
        <button type="button" className="btn" disabled={!payload} onClick={onSimulatePost}>
          Simulate post
        </button>
        <button type="button" className="btn ghost" disabled={queue.length === 0} onClick={onClear}>
          Clear queue ({queue.length})
        </button>
      </div>
      {payload ? (
        <pre className="json-view">{JSON.stringify(payload, null, 2)}</pre>
      ) : (
        <p className="muted">Generate a brief to preview the CareHub-shaped payload.</p>
      )}
    </section>
  )
}
