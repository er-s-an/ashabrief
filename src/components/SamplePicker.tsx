import { SAMPLE_VISITS } from '../lib/samples'
import type { SampleVisit } from '../lib/types'

interface Props {
  activeId?: string
  onPick: (sample: SampleVisit) => void
}

export function SamplePicker({ activeId, onPick }: Props) {
  return (
    <div className="sample-grid">
      {SAMPLE_VISITS.map((s) => (
        <button
          key={s.id}
          type="button"
          className={`sample-card ${activeId === s.id ? 'active' : ''}`}
          onClick={() => onPick(s)}
        >
          <span className="sample-tag">{s.programArea}</span>
          <span className="sample-title">{s.title}</span>
          <span className="sample-blurb">{s.blurb}</span>
        </button>
      ))}
    </div>
  )
}
