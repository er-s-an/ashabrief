interface Props {
  value: string
  onChange: (v: string) => void
  onGenerate: () => void
  busy?: boolean
}

export function NoteInput({ value, onChange, onGenerate, busy }: Props) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Vernacular visit note</h2>
        <span className="hint">Hindi · Hinglish · English — no PHI in demos</span>
      </div>
      <textarea
        className="note-area"
        rows={8}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste or type the ASHA home-visit note…"
        spellCheck={false}
      />
      <div className="row-actions">
        <button
          type="button"
          className="btn primary"
          disabled={!value.trim() || busy}
          onClick={onGenerate}
        >
          Generate care brief
        </button>
        <button
          type="button"
          className="btn ghost"
          disabled={!value}
          onClick={() => onChange('')}
        >
          Clear
        </button>
      </div>
    </section>
  )
}
