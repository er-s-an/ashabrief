# AshaBrief

**Vernacular home-visit notes → structured care briefs for India’s ASHA / frontline health workers.**

Impact area: **06 Health** · Contest: [Code for a Billion — Bharat Agentic-AI Hackathon 2026](https://codeforindia.org/hackathon) (Code for India)  
License: **MIT** · Stack: Vite · React · TypeScript · offline-first static web demo

> Not submitted. Soft registration on CFI is already done. Do **not** bind a card or upgrade AgentFoundry to paid for this repo.

## Problem size & severity

India’s **Accredited Social Health Activist (ASHA)** network is on the order of **~1 million** community health workers, covering roughly **hundreds of millions** of rural and peri-urban residents for maternal, child, TB, and NCD touchpoints.

After each home visit, workers must turn messy **vernacular** notes (Hindi / regional languages / Hinglish) into something a supervisor, ANM, or facility can act on. On a **weak-network phone**, English medical forms and jargon slow that handoff. Missed danger signs, delayed referrals, and incomplete follow-ups are not paperwork quirks — they are care gaps.

AshaBrief attacks the documentation bottleneck: keep the worker in their own language, emit a **structured English care brief** (symptoms, referral, checklist) that can later plug into care-coordination systems.

## How it works

1. ASHA (or judge) pastes / loads a vernacular visit note.
2. An **offline lexicon engine** (`src/lib/briefEngine.ts`) detects cues in Hindi Devanagari, Hinglish, and English — no cloud LLM required for the demo path.
3. The UI shows a **Care Brief**: urgency, program area, findings with evidence spans, referral plan, and a follow-up checklist.
4. A **mock xSpan CareHub adapter** shapes a care-coordination JSON event and stores it in a **local offline queue** (`localStorage`).

```
vernacular note  →  offline lexicon  →  CareBrief  →  CareHub mock payload (queued)
```

### Honesty about mocks

| Piece | Status |
| --- | --- |
| Brief generation | **Real** offline deterministic engine (lexicon + rules). Not a PPT. |
| UI + local persistence | **Real** (device-local briefs & queue). |
| xSpan CareHub / live API | **Mock only** — payload schema is illustrative; endpoint is a placeholder. Documented in UI and `carehubAdapter.ts`. |
| AgentFoundry agents / paid SMART-Code | **Not used** in this thin demo (AgentFoundry-friendly structure; plain Vite runs free). |
| Clinical validation | **None** — demo / decision-support for documentation, **not** a medical device. |

## Demo walkthrough (≤2 minutes)

1. Open the deployed demo (see BUILD-STATUS) or run locally.
2. Click sample **ANC · fever & swelling** (Hindi).
3. Press **Generate care brief** — expect priority/urgent cues, maternal program, referral, checklist.
4. Open **xSpan CareHub adapter** → **Queue locally** / **Simulate post** and inspect JSON.
5. Optionally toggle airplane mode: generation still works; queue remains on device.
6. Try **Child · diarrhea**, **TB cough**, and **NCD sugar** samples.

## Local run

```bash
cd /workspace/competitions/bharat-ashabrief   # or your clone
npm install
npm run dev
```

Production build (static, Vercel-friendly):

```bash
npm run build
npm run preview
```

Deploy (if Vercel CLI is already authenticated):

```bash
npx vercel --prod --yes
```

## Repository layout

- `src/lib/briefEngine.ts` — offline vernacular → brief
- `src/lib/carehubAdapter.ts` — mock CareHub payload + queue
- `src/lib/samples.ts` — synthetic Hindi / Hinglish / English notes (no PHI)
- `src/App.tsx` — judge-facing English UI
- `SCRIPT.md` — ≤3 min pitch
- `BUILD-STATUS.md` — links, mocks, Submit gate

## Pitch criteria mapping (CFI 4×25%)

| Criterion | AshaBrief angle |
| --- | --- |
| Size | ~1M ASHA + rural populations they serve |
| Severity | Delayed referral / incomplete surveillance after visits |
| Quality | End-to-end brief generation + honest CareHub stub + weak-net UX |
| Proven impact | Demo + local queue metrics for now; field pilot is next after「交」 |

## License

MIT — see `LICENSE`. Intended for OSS contribution to Code for India’s public-goods posture (Apache-2.0/MIT). Contributors retain attribution.
