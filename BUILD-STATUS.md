# AshaBrief · BUILD-STATUS

**Updated:** 2026-11-02 ~02:40 Asia/Shanghai (UTC+8)  
**Auth:** User Build (not Submit) via 比赛群 assign 2026-11-02  
**Hard stops honored:** no CFI project Submit · no card bind · no AgentFoundry paid upgrade · no re-register

## Links

| Item | URL / value |
| --- | --- |
| Demo (Vercel) | https://bharat-ashabrief.vercel.app |
| GitHub | https://github.com/er-s-an/ashabrief |
| SHA (`main`) | `06b9f1042bd6ac8db02c85bbab6cd39d65825b39` |
| Review clip deep link | https://review-clips.vercel.app/v/ashabrief-explainer |
| Pitch script | `SCRIPT.md` (≤3 min EN) |
| Local path | `/workspace/competitions/bharat-ashabrief/` |
| CFI Soft | DONE earlier — Jiachen XIE / `jiachexie6-c@my.cityu.edu.hk` — **do not re-register** |
| Contest hub | https://codeforindia.org/hackathon |
| Impact | **06 Health** |
| License | MIT |

## What’s done

- [x] Working Vite/React/TS demo — vernacular note → structured care brief end-to-end
- [x] Offline lexicon engine (`src/lib/briefEngine.ts`) — Hindi / Hinglish / English cues
- [x] Four synthetic samples (ANC, child diarrhea, TB cough, NCD)
- [x] Follow-up checklist + urgency / referral / red flags
- [x] Mock xSpan CareHub adapter + localStorage offline queue (honest UI labeling)
- [x] English README (problem size/severity, honesty, walkthrough)
- [x] `SCRIPT.md` pitch
- [x] `npm run build` green; static `dist/` Vercel-friendly
- [x] Deployed to Vercel production alias
- [x] Public GitHub `er-s-an/ashabrief`
- [x] Review clip on review-clips (~36s EN VO)

## What’s mock / not claimed

| Piece | Status |
| --- | --- |
| CareHub / xSpan live API | **MOCK** — payload shape only; no network post to CareHub |
| LLM / AgentFoundry SMART-Code | **Not used** — free offline lexicon path |
| Clinical validation / medical device | **None** |
| Field pilot / proven impact data | **Not yet** — local queue counts only |
| CFI Submit form | **NOT done** — wait user「交」 |

## Local how-to

```bash
cd /workspace/competitions/bharat-ashabrief
npm install
npm run dev          # http://localhost:5173
npm run build && npm run preview
```

Redeploy:

```bash
npx vercel --prod --yes
```

## Next when user says「交」

1. Confirm demo + GitHub + clip URLs still HTTP 200.
2. Fill CFI / GitHub structured Submit form (problem statement, repo, demo, OSS to CFI org as required).
3. Do **not** bind a card or pay for AgentFoundry unless user explicitly confirms a forced wall.
4. Optional: wire a real CareHub adapter behind a feature flag; keep mock honesty until live.

## Feature bullets (for parent / paste)

- Offline-first care brief from vernacular ASHA notes
- Symptom evidence spans + urgency + referral + checklist
- Judge English UI + Hindi/Hinglish sample inputs
- Honest mock CareHub JSON queue for xSpan-style coordination
- MIT OSS · deployed cloud demo · public GitHub
