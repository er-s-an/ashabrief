# AshaBrief · Pitch script (≤ 3 minutes)

**Language:** English (judge-facing). Demo can show Hindi input on screen.  
**Target length:** ~2:00–2:30 spoken.

---

### Hook (0:00–0:25)

India’s ASHA workers — about a million strong — walk village after village for maternal care, child health, TB, and chronic disease. After a home visit, the real work is still ahead: turn a vernacular note on a weak-network phone into something a clinic can act on. English forms and medical jargon get in the way. That delay is not paperwork — it is a care gap.

### Problem (0:25–0:50)

Today, notes stay informal. Danger signs can be buried in Hindi or Hinglish. Referrals are late. Follow-ups are memory. Supervisors need structure; workers need to stay in their own language — offline.

### Mechanism (0:50–1:35)

**AshaBrief** is a thin, offline-first web agent for that handoff.

1. Worker pastes or speaks a vernacular visit note.  
2. An on-device lexicon engine extracts symptoms, urgency, and program area — maternal, child, infectious, NCD.  
3. It emits a **structured care brief**: findings with evidence, referral plan, and a checklist.  
4. A **CareHub-shaped JSON** is queued locally for care-coordination APIs such as xSpan CareHub.

Be honest on stage: **CareHub is mocked in this build.** The brief generation is real and runs without network.

### Live demo (1:35–2:20)

- Load **ANC · fever & swelling**.  
- Generate — show swelling, fever, breathlessness cues, referral, checklist.  
- Queue CareHub mock payload.  
- Optional: airplane mode — still generates.

### Close (2:20–2:45)

Size: workforce and rural reach. Severity: missed escalation. Quality: end-to-end brief, not a slide deck. Impact path: local queue today, facility pilot next.

AshaBrief — so frontline notes become follow-ups the system can actually run.

**Stop. Do not claim live CareHub or clinical certification.**
