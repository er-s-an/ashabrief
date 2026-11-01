import type { CareBrief, CareHubPayload } from './types'

/**
 * Mock xSpan CareHub adapter.
 * Honest stub: shapes a care-coordination payload and queues it locally.
 * Does NOT call a live CareHub API (none wired in this thin demo).
 */
export function toCareHubPayload(
  brief: CareBrief,
  mode: 'queued-local' | 'simulated-posted' = 'queued-local',
): CareHubPayload {
  return {
    schema: 'ashabrief.carehub.mock/v1',
    adapter: 'mock',
    honesty:
      'Mock adapter only. Payload mirrors a CareHub-style care-coordination event for judges; no live xSpan endpoint is called.',
    event: 'visit.brief.created',
    briefId: brief.id,
    careEpisode: {
      subjectAlias: brief.patientAlias,
      programArea: brief.programArea,
      urgency: brief.urgency,
      symptoms: brief.symptoms.map((s) => ({
        code: s.code,
        label: s.labelEn,
      })),
      referral: brief.referral,
      followUps: brief.followUps,
    },
    sync: {
      status: mode,
      queuedAt: new Date().toISOString(),
      endpointHint: 'https://carehub.example/xspan/v1/episodes (placeholder — not live)',
    },
  }
}

const QUEUE_KEY = 'ashabrief.carehub.queue.v1'

export function enqueuePayload(payload: CareHubPayload): CareHubPayload[] {
  const q = readQueue()
  const next = [payload, ...q].slice(0, 20)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(next))
  return next
}

export function readQueue(): CareHubPayload[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CareHubPayload[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function clearQueue(): void {
  localStorage.removeItem(QUEUE_KEY)
}
