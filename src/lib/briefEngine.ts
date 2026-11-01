import type {
  CareBrief,
  FollowUpItem,
  ProgramArea,
  ReferralPlan,
  SymptomFinding,
  Urgency,
} from './types'

interface Lexeme {
  code: string
  labelEn: string
  patterns: RegExp[]
  programHints?: ProgramArea[]
  urgencyBump?: Urgency
  redFlag?: boolean
}

const LEXICON: Lexeme[] = [
  {
    code: 'fever',
    labelEn: 'Fever',
    patterns: [/बुखार/u, /\bfever\b/i, /\bbukhar\b/i],
    urgencyBump: 'priority',
  },
  {
    code: 'edema',
    labelEn: 'Swelling / edema',
    patterns: [/सूजन/u, /\bswelling\b/i, /\bedema\b/i, /पैर में सूजन/u],
    programHints: ['maternal'],
    urgencyBump: 'priority',
  },
  {
    code: 'headache',
    labelEn: 'Headache',
    patterns: [/सिर दर्द/u, /सिरदर्द/u, /\bheadache\b/i],
    programHints: ['maternal'],
  },
  {
    code: 'dyspnea',
    labelEn: 'Shortness of breath',
    patterns: [/साँस फूल/u, /सांस फूल/u, /\bbreath(?:ing)?\b/i, /\bdyspn/i],
    urgencyBump: 'urgent',
    redFlag: true,
  },
  {
    code: 'hypertension_hint',
    labelEn: 'High BP mentioned',
    patterns: [/\bBP\b/, /ब्लड प्रेशर/u, /\bhigh\s*bp\b/i, /दबाव ज्यादा/u],
    programHints: ['maternal', 'ncd'],
    urgencyBump: 'priority',
  },
  {
    code: 'diarrhea',
    labelEn: 'Diarrhea',
    patterns: [/दस्त/u, /\bdiarrhea\b/i, /\bloose\s*motion\b/i, /\bwatery\s*stool\b/i],
    programHints: ['child'],
    urgencyBump: 'priority',
  },
  {
    code: 'vomiting',
    labelEn: 'Vomiting',
    patterns: [/उल्टी/u, /\bvomit/i],
    programHints: ['child'],
  },
  {
    code: 'oliguria',
    labelEn: 'Reduced urine output',
    patterns: [/पेशाब कम/u, /\burine\s*(?:low|less|reduced)\b/i, /\boliguria\b/i],
    urgencyBump: 'urgent',
    redFlag: true,
  },
  {
    code: 'cough',
    labelEn: 'Cough',
    patterns: [/खांसी/u, /\bcough\b/i],
    programHints: ['infectious'],
  },
  {
    code: 'night_sweats',
    labelEn: 'Night sweats',
    patterns: [/रात को पसीना/u, /\bnight\s*sweat/i],
    programHints: ['infectious'],
    urgencyBump: 'priority',
  },
  {
    code: 'weight_loss',
    labelEn: 'Weight loss',
    patterns: [/वजन कम/u, /\bweight\s*(?:loss|low|less|कम)/i],
    programHints: ['infectious', 'ncd'],
  },
  {
    code: 'hemoptysis',
    labelEn: 'Blood in cough (possible)',
    patterns: [/खून वाली खांसी/u, /\bblood(?:y)?\s*cough/i, /\bhemoptysis\b/i],
    programHints: ['infectious'],
    urgencyBump: 'urgent',
    redFlag: true,
  },
  {
    code: 'hyperglycemia',
    labelEn: 'High blood sugar',
    patterns: [/शुगर/u, /\bsugar\s*high\b/i, /\bdiabetes\b/i, /\bfasting\s*sugar\b/i],
    programHints: ['ncd'],
    urgencyBump: 'priority',
  },
  {
    code: 'foot_ulcer',
    labelEn: 'Non-healing foot wound',
    patterns: [/पैर.*घाव/u, /\bfoot\b.*\bwound\b/i, /\bulcer\b/i, /not healing/i],
    programHints: ['ncd'],
    urgencyBump: 'priority',
    redFlag: true,
  },
  {
    code: 'neuropathy',
    labelEn: 'Foot tingling / neuropathy hint',
    patterns: [/झनझना/u, /\btingling\b/i, /\bneuropathy\b/i],
    programHints: ['ncd'],
  },
  {
    code: 'poor_appetite',
    labelEn: 'Poor appetite',
    patterns: [/खाना कम/u, /\bappetite\b/i, /कम खा/u],
  },
  {
    code: 'pregnancy',
    labelEn: 'Pregnancy / ANC context',
    patterns: [/गर्भावस्था/u, /गर्भवती/u, /\bpregnan/i, /\bANC\b/, /महीने/u],
    programHints: ['maternal'],
  },
]

function detectLang(note: string): CareBrief['sourceLang'] {
  const hasDevanagari = /[\u0900-\u097F]/.test(note)
  const hasLatin = /[A-Za-z]{3,}/.test(note)
  if (hasDevanagari && hasLatin) return 'mixed'
  if (hasDevanagari) return 'hi'
  return 'en'
}

function extractAlias(note: string): string {
  const hi = note.match(
    /([ऀ-ॿ]{2,}(?:\s+[ऀ-ॿ]{2,})?)\s*(?:,|।|\.|गाँव|गांव)/u,
  )
  if (hi?.[1]) return hi[1]
  const en = note.match(
    /(?:Patient|patient|Name|name)\s+([A-Z][a-z]+)|([A-Z][a-z]{2,})\s*,?\s*(?:about|age|~|\d)/,
  )
  if (en?.[1] || en?.[2]) return (en[1] || en[2])!
  const firstToken = note.trim().split(/[\s,।.]+/u)[0]
  return firstToken?.slice(0, 24) || 'Anonymous visit'
}

function extractVillage(note: string): string | undefined {
  const m = note.match(/(?:गाँव|गांव|village)\s*([ऀ-ॿA-Za-z]+)/iu)
  return m?.[1]
}

function maxUrgency(a: Urgency, b: Urgency): Urgency {
  const rank: Record<Urgency, number> = { routine: 0, priority: 1, urgent: 2 }
  return rank[b] > rank[a] ? b : a
}

function inferProgram(
  note: string,
  hits: Lexeme[],
  fallback?: ProgramArea,
): ProgramArea {
  const scores: Record<ProgramArea, number> = {
    maternal: 0,
    child: 0,
    infectious: 0,
    ncd: 0,
    general: 0,
  }
  for (const h of hits) {
    for (const p of h.programHints || []) scores[p] += 2
  }
  if (/गर्भ|ANC|pregnan|महीने/i.test(note)) scores.maternal += 3
  if (/बच्चा|infant|month|ORS|AWW/i.test(note)) scores.child += 3
  if (/TB|खांसी|sputum|cough/i.test(note)) scores.infectious += 2
  if (/diabetes|sugar|शुगर|foot/i.test(note)) scores.ncd += 2

  const best = (Object.entries(scores) as [ProgramArea, number][]).sort(
    (a, b) => b[1] - a[1],
  )[0]
  if (best && best[1] > 0) return best[0]
  return fallback || 'general'
}

function buildReferral(
  urgency: Urgency,
  program: ProgramArea,
  redFlags: string[],
  symptoms: SymptomFinding[],
): ReferralPlan {
  if (urgency === 'urgent' || redFlags.length > 0) {
    const facility =
      program === 'infectious' || program === 'maternal' ? 'CHC' : 'PHC'
    return {
      needed: true,
      facilityLevel: facility,
      reasonEn:
        redFlags[0] ||
        'Red-flag or urgent findings in vernacular note require same-day clinical review.',
      timeframe: 'Same day / within 24 hours',
    }
  }
  if (urgency === 'priority') {
    return {
      needed: true,
      facilityLevel: program === 'infectious' ? 'CHC' : 'PHC',
      reasonEn: `Priority ${program} findings (${symptoms
        .slice(0, 2)
        .map((s) => s.labelEn)
        .join(', ') || 'clinical cues'}) warrant facility review.`,
      timeframe: 'Within 48–72 hours',
    }
  }
  return {
    needed: false,
    facilityLevel: 'sub-centre',
    reasonEn: 'No urgent referral cues detected — continue ASHA follow-up.',
    timeframe: 'Next scheduled visit',
  }
}

function buildFollowUps(
  program: ProgramArea,
  referral: ReferralPlan,
  symptoms: SymptomFinding[],
): FollowUpItem[] {
  const items: FollowUpItem[] = []
  const has = (code: string) => symptoms.some((s) => s.code === code)

  items.push({
    id: 'fu-document',
    taskEn: 'Confirm structured brief with family in vernacular; keep paper register entry.',
    dueInDays: 0,
    owner: 'ASHA',
    done: false,
  })

  if (referral.needed) {
    items.push({
      id: 'fu-escort',
      taskEn: `Help family reach ${referral.facilityLevel} (${referral.timeframe}).`,
      dueInDays: urgencyDays(referral),
      owner: 'ASHA',
      done: false,
    })
  }

  if (program === 'maternal') {
    items.push({
      id: 'fu-anc',
      taskEn: 'Schedule / confirm next ANC contact; check BP and fetal movement counselling.',
      dueInDays: 3,
      owner: 'ANM',
      done: false,
    })
    if (has('edema') || has('hypertension_hint') || has('dyspnea')) {
      items.push({
        id: 'fu-danger-signs',
        taskEn: 'Counsel danger signs (severe headache, vision change, breathlessness, bleeding).',
        dueInDays: 0,
        owner: 'ASHA',
        done: false,
      })
    }
  }

  if (program === 'child') {
    items.push({
      id: 'fu-ors',
      taskEn: 'Demonstrate ORS / zinc per protocol; reassess hydration tomorrow.',
      dueInDays: 1,
      owner: 'ASHA',
      done: false,
    })
    items.push({
      id: 'fu-aww',
      taskEn: 'Notify Anganwadi worker for growth / feeding follow-up.',
      dueInDays: 2,
      owner: 'ASHA',
      done: false,
    })
  }

  if (program === 'infectious') {
    items.push({
      id: 'fu-sputum',
      taskEn: 'Arrange sputum / TB screening pathway at CHC; note household contacts.',
      dueInDays: 2,
      owner: 'ASHA',
      done: false,
    })
  }

  if (program === 'ncd') {
    items.push({
      id: 'fu-meds',
      taskEn: 'Check medicine refill and adherence; bring strip / Rx to PHC.',
      dueInDays: 3,
      owner: 'family',
      done: false,
    })
    if (has('foot_ulcer')) {
      items.push({
        id: 'fu-foot',
        taskEn: 'Daily foot care: clean, keep dry, no barefoot walking; photo if network allows.',
        dueInDays: 1,
        owner: 'family',
        done: false,
      })
    }
  }

  return items
}

function urgencyDays(referral: ReferralPlan): number {
  if (/24|same day/i.test(referral.timeframe)) return 0
  if (/48|72/i.test(referral.timeframe)) return 2
  return 7
}

function summarize(
  alias: string,
  program: ProgramArea,
  urgency: Urgency,
  symptoms: SymptomFinding[],
  referral: ReferralPlan,
): string {
  const sx =
    symptoms.map((s) => s.labelEn).slice(0, 4).join(', ') || 'no lexicon hits'
  const ref = referral.needed
    ? `Referral: ${referral.facilityLevel} (${referral.timeframe}).`
    : 'No urgent referral flagged.'
  return `${alias} — ${program} visit (${urgency}). Key findings: ${sx}. ${ref}`
}

/** Offline-first vernacular → structured CareBrief. No network, no paid LLM. */
export function generateCareBrief(
  note: string,
  opts?: { programHint?: ProgramArea },
): CareBrief {
  const trimmed = note.trim()
  if (!trimmed) {
    throw new Error('Visit note is empty')
  }

  const sourceLang = detectLang(trimmed)
  const patientAlias = extractAlias(trimmed)
  const villageHint = extractVillage(trimmed)

  const symptoms: SymptomFinding[] = []
  const redFlags: string[] = []
  let urgency: Urgency = 'routine'
  const hitLexemes: Lexeme[] = []

  for (const lex of LEXICON) {
    const evidence: string[] = []
    for (const re of lex.patterns) {
      const m = trimmed.match(re)
      if (m) evidence.push(m[0])
    }
    if (evidence.length === 0) continue
    hitLexemes.push(lex)
    symptoms.push({
      code: lex.code,
      labelEn: lex.labelEn,
      confidence: Math.min(0.55 + evidence.length * 0.15, 0.95),
      evidence,
    })
    if (lex.urgencyBump) urgency = maxUrgency(urgency, lex.urgencyBump)
    if (lex.redFlag) {
      redFlags.push(`${lex.labelEn} cue in note — escalate.`)
      urgency = maxUrgency(urgency, 'urgent')
    }
  }

  const programArea = inferProgram(trimmed, hitLexemes, opts?.programHint)
  const referral = buildReferral(urgency, programArea, redFlags, symptoms)
  const followUps = buildFollowUps(programArea, referral, symptoms)
  const vitalsHints: string[] = []
  if (/\bBP\b|ब्लड प्रेशर/u.test(trimmed)) vitalsHints.push('BP mentioned — capture numeric value at facility')
  if (/sugar|शुगर|glucose/i.test(trimmed)) vitalsHints.push('Glucose mentioned — capture strip reading')
  if (/weight|वजन/i.test(trimmed)) vitalsHints.push('Weight change mentioned — plot on growth / NCD card')

  const createdAt = new Date().toISOString()
  const id = `brief_${createdAt.slice(0, 10)}_${Math.random().toString(36).slice(2, 8)}`

  return {
    id,
    createdAt,
    patientAlias,
    villageHint,
    programArea,
    urgency,
    summaryEn: summarize(patientAlias, programArea, urgency, symptoms, referral),
    sourceNote: trimmed,
    sourceLang,
    symptoms,
    vitalsHints,
    referral,
    followUps,
    redFlags,
    engine: 'offline-lexicon-v1',
    offlineGenerated: true,
  }
}
