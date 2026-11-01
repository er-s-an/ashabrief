/** Structured care brief produced from vernacular ASHA visit notes. */

export type Urgency = 'routine' | 'priority' | 'urgent'

export type ProgramArea =
  | 'maternal'
  | 'child'
  | 'infectious'
  | 'ncd'
  | 'general'

export interface SymptomFinding {
  code: string
  labelEn: string
  labelVernacular?: string
  confidence: number
  evidence: string[]
}

export interface ReferralPlan {
  needed: boolean
  facilityLevel: 'sub-centre' | 'PHC' | 'CHC' | 'district-hospital' | 'none'
  reasonEn: string
  timeframe: string
}

export interface FollowUpItem {
  id: string
  taskEn: string
  dueInDays: number
  owner: 'ASHA' | 'ANM' | 'family' | 'facility'
  done: boolean
}

export interface CareBrief {
  id: string
  createdAt: string
  patientAlias: string
  villageHint?: string
  programArea: ProgramArea
  urgency: Urgency
  summaryEn: string
  sourceNote: string
  sourceLang: 'hi' | 'en' | 'mixed'
  symptoms: SymptomFinding[]
  vitalsHints: string[]
  referral: ReferralPlan
  followUps: FollowUpItem[]
  redFlags: string[]
  engine: 'offline-lexicon-v1'
  offlineGenerated: boolean
}

/** Mock xSpan CareHub-style coordination payload (honest stub). */
export interface CareHubPayload {
  schema: 'ashabrief.carehub.mock/v1'
  adapter: 'mock'
  honesty: string
  event: 'visit.brief.created'
  briefId: string
  careEpisode: {
    subjectAlias: string
    programArea: ProgramArea
    urgency: Urgency
    symptoms: Array<{ code: string; label: string }>
    referral: ReferralPlan
    followUps: FollowUpItem[]
  }
  sync: {
    status: 'queued-local' | 'simulated-posted'
    queuedAt: string
    endpointHint: string
  }
}

export interface SampleVisit {
  id: string
  title: string
  programArea: ProgramArea
  lang: 'hi' | 'en' | 'mixed'
  note: string
  blurb: string
}
