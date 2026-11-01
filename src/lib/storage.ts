import type { CareBrief } from './types'

const BRIEFS_KEY = 'ashabrief.briefs.v1'

export function saveBrief(brief: CareBrief): CareBrief[] {
  const all = listBriefs().filter((b) => b.id !== brief.id)
  const next = [brief, ...all].slice(0, 30)
  localStorage.setItem(BRIEFS_KEY, JSON.stringify(next))
  return next
}

export function listBriefs(): CareBrief[] {
  try {
    const raw = localStorage.getItem(BRIEFS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CareBrief[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
