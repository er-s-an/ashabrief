import { useMemo, useState } from 'react'
import { BriefPanel } from './components/BriefPanel'
import { CareHubPanel } from './components/CareHubPanel'
import { NoteInput } from './components/NoteInput'
import { OfflineBanner } from './components/OfflineBanner'
import { SamplePicker } from './components/SamplePicker'
import { Walkthrough } from './components/Walkthrough'
import { generateCareBrief } from './lib/briefEngine'
import {
  clearQueue,
  enqueuePayload,
  readQueue,
  toCareHubPayload,
} from './lib/carehubAdapter'
import { saveBrief } from './lib/storage'
import type { CareBrief, CareHubPayload, SampleVisit } from './lib/types'
import './App.css'

export default function App() {
  const [note, setNote] = useState('')
  const [activeSample, setActiveSample] = useState<string | undefined>()
  const [brief, setBrief] = useState<CareBrief | null>(null)
  const [payload, setPayload] = useState<CareHubPayload | null>(null)
  const [queue, setQueue] = useState<CareHubPayload[]>(() => readQueue())
  const [error, setError] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)

  const savedCount = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('ashabrief.briefs.v1') || '[]').length
    } catch {
      return 0
    }
  }, [brief])

  function pickSample(sample: SampleVisit) {
    setActiveSample(sample.id)
    setNote(sample.note)
    setError(null)
    setFlash(`Loaded sample: ${sample.title}`)
  }

  function onGenerate() {
    try {
      setError(null)
      const sampleProgram = (
        [
          ['anc-fever', 'maternal'],
          ['child-diarrhea', 'child'],
          ['tb-cough', 'infectious'],
          ['ncd-sugar', 'ncd'],
        ] as const
      ).find(([id]) => id === activeSample)?.[1]

      const next = generateCareBrief(note, {
        programHint: sampleProgram,
      })
      setBrief(next)
      saveBrief(next)
      const p = toCareHubPayload(next, 'queued-local')
      setPayload(p)
      setFlash(`Brief ${next.id} generated offline`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate brief')
    }
  }

  function onToggleFollowUp(id: string) {
    if (!brief) return
    const next: CareBrief = {
      ...brief,
      followUps: brief.followUps.map((f) =>
        f.id === id ? { ...f, done: !f.done } : f,
      ),
    }
    setBrief(next)
    saveBrief(next)
    setPayload(toCareHubPayload(next, payload?.sync.status || 'queued-local'))
  }

  function onQueue() {
    if (!payload) return
    const p = { ...payload, sync: { ...payload.sync, status: 'queued-local' as const } }
    setPayload(p)
    setQueue(enqueuePayload(p))
    setFlash('Queued CareHub mock payload in localStorage (offline-safe)')
  }

  function onSimulatePost() {
    if (!payload) return
    const p = {
      ...payload,
      sync: {
        ...payload.sync,
        status: 'simulated-posted' as const,
        queuedAt: new Date().toISOString(),
      },
    }
    setPayload(p)
    setQueue(enqueuePayload(p))
    setFlash('Simulated CareHub post — still mock, no network call')
  }

  function onClearQueue() {
    clearQueue()
    setQueue([])
    setFlash('Local CareHub queue cleared')
  }

  return (
    <div className="app">
      <OfflineBanner />
      <header className="hero">
        <div className="brand">
          <span className="logo" aria-hidden>
            अ
          </span>
          <div>
            <p className="eyebrow">Code for a Billion · Impact 06 Health</p>
            <h1>AshaBrief</h1>
            <p className="tagline">
              Vernacular home-visit notes → structured care briefs for ASHA workers —
              offline-first on a weak-network phone.
            </p>
          </div>
        </div>
        <div className="hero-stats">
          <div>
            <strong>~1M</strong>
            <span>ASHA workforce</span>
          </div>
          <div>
            <strong>Rural</strong>
            <span>weak-net first</span>
          </div>
          <div>
            <strong>{savedCount}</strong>
            <span>briefs on device</span>
          </div>
        </div>
      </header>

      <Walkthrough />

      {flash && (
        <div className="flash" role="status">
          {flash}
        </div>
      )}
      {error && (
        <div className="flash error" role="alert">
          {error}
        </div>
      )}

      <section className="panel">
        <div className="panel-head">
          <h2>Demo samples</h2>
          <span className="hint">Synthetic notes — not real patient data</span>
        </div>
        <SamplePicker activeId={activeSample} onPick={pickSample} />
      </section>

      <div className="layout">
        <NoteInput value={note} onChange={setNote} onGenerate={onGenerate} />
        <BriefPanel brief={brief} onToggleFollowUp={onToggleFollowUp} />
      </div>

      <CareHubPanel
        payload={payload}
        queue={queue}
        onQueue={onQueue}
        onSimulatePost={onSimulatePost}
        onClear={onClearQueue}
      />

      <footer className="footer">
        <p>
          AshaBrief · MIT · Built for Bharat Agentic-AI / Code for India · AgentFoundry-friendly
          Vite/React demo · CareHub adapter is <strong>mock</strong>
        </p>
        <p className="muted">
          Not a medical device. Decision support for documentation only. Do not Submit until
          organisers pack is ready and user says 「交」.
        </p>
      </footer>
    </div>
  )
}
